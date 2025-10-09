from app.models import *
from app.database import cursor, conn

def hf_return_tasks():
    try:
        cursor.execute("SELECT * FROM alltask")
        tasks = cursor.fetchall()
        if tasks:
            return tasks
        else:
            return {"message: No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching task"}

def hf_return_one_task(tid: int):
    try:
        cursor.execute("SELECT * FROM alltask WHERE id = %s", (tid,))
        task_info = cursor.fetchone()
        if task_info:
            return task_info
        else:
            return {"message": "No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching task"}

def hf_add_task(new_task: Task):
    try:
        cursor.execute(
            """ INSERT INTO alltask (description, status, priority, userid) VALUES (%s, %s, %s, %s) RETURNING * """,
            (new_task.name, new_task.status, new_task.priority, new_task.userid))
        conn.commit()
        return {"message": "Task addition successful"}
    except Exception as e:
        conn.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_update_task_status(tid: int, tstatus: int):
    try:
        cursor.execute(""" UPDATE alltask SET status = (%s) where id = (%s) returning *""",
                       (str(tstatus), str(tid)))
        updated_task = cursor.fetchone()
        conn.commit()
        if updated_task:
            return {"message": " Task update successful"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        conn.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_update_task(tid: int, updated_task: Task):
    try:
        cursor.execute(""" UPDATE alltask SET description = (%s), status = (%s), priority = (%s) where id = (%s)  returning *""",
                       (updated_task.name, str(updated_task.status), str(updated_task.priority), str(tid)) )
        updated_task = cursor.fetchone()
        conn.commit()
        if updated_task:
            return {"message": " Task update successful"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        conn.rollback()
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_delete_task(tid: int):
    try:
        cursor.execute(""" DELETE FROM alltask WHERE id = (%s) returning *""", (str(tid)))
        deleted_task = cursor.fetchone()
        conn.commit()
        if deleted_task:
            return {"message": "Task deletion successful"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "An error has occurred"}



