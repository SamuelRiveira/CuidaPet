import psycopg2
import config


class Database:
    @staticmethod
    def get_connection():
        return psycopg2.connect(**config.DB_CONFIG)

    @staticmethod
    def execute_query(query, params=None, fetch=True):
        try:
            connection = Database.get_connection()
            cursor = connection.cursor()

            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            result = None
            if fetch and cursor.description:
                columns = [desc[0] for desc in cursor.description]
                results = cursor.fetchall()
                result = [dict(zip(columns, row)) for row in results]

            if not fetch:
                connection.commit()

            cursor.close()
            connection.close()
            return result
        except psycopg2.Error as e:
            print(f"Database error: {e}")
            raise

    @staticmethod
    def insert(table, data, returning=None):
        columns = list(data.keys())
        values = list(data.values())

        placeholders = ", ".join(["%s"] * len(columns))
        column_str = ", ".join(columns)

        query = f"INSERT INTO {table} ({column_str}) VALUES ({placeholders})"

        if returning:
            query += f" RETURNING {returning}"

        return Database.execute_query(query, tuple(values))

    @staticmethod
    def update(table, data, condition, condition_params):
        set_clause = ", ".join([f"{column} = %s" for column in data.keys()])
        values = list(data.values()) + list(condition_params)

        query = f"UPDATE {table} SET {set_clause} WHERE {condition}"

        return Database.execute_query(query, tuple(values), fetch=False)

    @staticmethod
    def select(table, columns="*", condition=None, condition_params=None, order_by=None):
        query = f"SELECT {columns} FROM {table}"

        if condition:
            query += f" WHERE {condition}"

        if order_by:
            query += f" ORDER BY {order_by}"

        return Database.execute_query(query, condition_params if condition_params else None)