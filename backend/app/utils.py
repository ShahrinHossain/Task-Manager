from multiprocessing.sharedctypes import synchronized

from app.models import *

def hf_return_tasks(db):
    try:
        tasks = db.query(Task).all()
        if tasks:
            return tasks
        else:
            return {"message: No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching task"}

def hf_return_one_task(tid: int, db):
    try:
        task_info = db.query(Task).filter(Task.id == tid).first()
        if task_info:
            return task_info
        else:
            return {"message": "No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching task"}

def hf_add_task(new_task, db):
    try:
        db.add(Task(**new_task.dict()))
        db.commit()
        return {"message": "Task addition successful"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_update_task_status(tid: int, tstatus: int, db):
    try:
        changed_task = db.query(Task).filter(Task.id == tid)
        if changed_task.first():
            changed_task.update({"status" : tstatus}, synchronize_session=False)
            db.commit()
            return {"message": " Task update successful"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_update_task(tid: int, updated_task, db):
    try:
        changed_task = db.query(Task).filter(Task.id == tid)
        if changed_task.first():
            changed_task.update(updated_task.dict(), synchronize_session=False)
            db.commit()
            return {"message": " Task update successful"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}

def hf_delete_task(tid: int, db):
    try:
        deleted_task = db.query(Task).filter(Task.id == tid)
        if deleted_task.first():
            deleted_task.delete(synchronize_session=False)
            db.commit()
            return {"message": "Task deletion successful"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "An error has occurred"}



