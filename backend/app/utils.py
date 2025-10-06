from random import randrange
from app.models import *

def hf_assign_random_id(tasks: List[Task]):
    for task in tasks:
        task.task_id = randrange(0, 10)
        print("Assigned ID:", task.task_id)
    return tasks

def hf_add_task(new_tasks: List[Task]):
    try:
        hf_assign_random_id(new_tasks)
        memory_db["tasks"].extend(new_tasks)
        hf_print_tasks(memory_db['tasks'])
        return {"message": "Task addition successful"}
    except Exception:
        return {"message": "An error has occurred"}

def hf_print_tasks(tasks: List[Task]):
    for task in tasks:
        print(task.model_dump())

def hf_organize_task(tid: int):
    for task in memory_db['tasks']:
        if task.task_id == tid:
            return task
    return {"message": "No task found"}

def hf_update_task_status(tid: int, tstatus: TaskStatus):
    for task in memory_db['tasks']:
        if task.task_id == tid:
            task.status = tstatus
            return {"message": " Task update successful"}
    return {"message": "No task found"}

def hf_update_task(tid: int, updated_task: Task):
    for task in memory_db['tasks']:
        if task.task_id == tid:
            task.name = updated_task.name
            task.status = updated_task.status
            return {"message": " Task update successful"}
    return {"message": "No task found"}

def hf_delete_task(tid: int):
    for task in memory_db['tasks']:
        if task.task_id == tid:
            memory_db['tasks'].remove(task)
            return {"message": "Task deletion successful"}
    return {"message": "No task found"}