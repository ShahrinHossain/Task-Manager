from random import randrange
from models import *

def hf_assign_random_id(tasks: List[Task]):
    for task in tasks:
        task.task_id = randrange(0, 10)
        print("Assigned ID:", task.task_id)
    return tasks

def hf_print_tasks(tasks: List[Task]):
    for task in tasks:
        print(task.model_dump())

def hf_organize_task(tid: int):
    for task in memory_db['tasks']:
        if task.task_id == tid:
            return task
    return {"message": "No task found"}


def hf_update_status(tid: int, tstatus: TaskStatus):
    for task in memory_db['tasks']:
        if task.task_id == tid:
            task.status = tstatus
            return {"message": " Task status updated"}
    return {"message": "No task found"}