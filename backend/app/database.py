import psycopg2
from psycopg2.extras import RealDictCursor
import time

while True:
    try:
        conn = psycopg2.connect(host= 'localhost', database= 'task_manager', user= 'postgres', password= 'Shaain147', cursor_factory= RealDictCursor)
        cursor = conn.cursor()
        print('Database Connection Was Successful')
        break
    except Exception as error:
        print('Connection to Database Failed')
        print('Error was ', error)
        time.sleep(2)
