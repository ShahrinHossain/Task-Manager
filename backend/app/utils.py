from datetime import date, timedelta
from app.models import *
from passlib.context import CryptContext
from sqlalchemy import func

pwd_context = CryptContext

PRIORITY_SCORES = {
    1: 20,  # high
    2: 15,  # moderate
    3: 10   # low
}

### Helper functions for routes

# Returns all the tasks of a user
def hf_return_tasks(db, current_user):
    try:
        tasks = db.query(Task).filter(Task.userid == current_user.id).all()
        return tasks
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching task"}


# Returns one task info of a user
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


# Adds a task for a user to the database
def hf_add_task(new_task, db, current_user):
    try:
        task_info = new_task.dict()
        task_info["userid"] = current_user.id
        db.add(Task(**task_info))
        db.commit()
        return {"message": "Task addition successful"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}


# Updates a task status for a user and changes score if needed
def hf_update_task_status(tid: int, tstatus: int, db, current_user):
    try:
        changed_task_query = db.query(Task).filter(Task.id == tid)
        changed_task = changed_task_query.first()
        if changed_task:
            if changed_task.userid == current_user.id:
                hf_update_score(tid, current_user.id, changed_task.priority, changed_task.priority, changed_task.status, tstatus, db)
                changed_task_query.update({"status" : tstatus}, synchronize_session=False)
                db.commit()
                return {"message": "Task update successful"}
            else:
                return {"message": "Unauthorized action"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}


# Updates a task info for a user and changes score if needed
def hf_update_task(tid: int, updated_task, db, current_user):
    try:
        changed_task_query = db.query(Task).filter(Task.id == tid)
        changed_task = changed_task_query.first()
        if changed_task:
            if changed_task.userid == current_user.id:
                hf_update_score(tid, current_user.id, changed_task.priority, updated_task.priority, changed_task.status, updated_task.status, db)
                changed_task_query.update(updated_task.dict(), synchronize_session=False)
                db.commit()
                return {"message": "Task update successful"}
            else:
                return {"message": "Unauthorized action"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print('Error:', e)
        return {"message": "An error has occurred"}


# Deletes a task from a user task list
def hf_delete_task(tid: int, db, current_user):
    try:
        deleted_task_query = db.query(Task).filter(Task.id == tid)
        deleted_task = deleted_task_query.first()
        if deleted_task:
            if deleted_task.userid == current_user.id:
                deleted_task_query.delete(synchronize_session=False)
                db.commit()
                return {"message": "Task deletion successful"}
            else:
                return {"message": "Unauthorized action"}
        else:
            return {"message": "No task found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "An error has occurred"}


# Returns user account info
def hf_return_user_info(db, current_user):
    try:
        user_info = db.query(User).filter(User.id == current_user.id).first()
        if user_info:
            return UserResponse.from_orm(user_info)
        else:
            return {"message": "No user found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching user info"}


# Changes the user info
def hf_edit_user_info(updated_user, db, current_user):
    try:
        changed_user_query = db.query(User).filter(User.id == current_user.id)
        changed_user_info = changed_user_query.first()
        if changed_user_info:
            changed_user_query.update(updated_user.dict(), synchronize_session=False)
            db.commit()
            return {"message": "User update successful"}
        else:
            return {"message": "No user found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "Error updating user info"}



# Adds a column for a user in the score table on first login of day
def hf_initiate_daily_score(db, uid):
    try:
        today = date.today()

        existing = db.query(Score).filter(
            Score.userid == uid,
            Score.created == today
        ).first()

        if not existing:
            new_score = Score(
                userid=uid,
                taskids=[],
                score=0,
                created=today
            )
            db.add(new_score)
            db.commit()
    except Exception as e:
        print("Error:", e)
        return {"message": "Error creating score entry"}


# Updates score by checking current and previous status and priority
def hf_update_score(tid, uid, old_priority, new_priority, old_status, new_status, db):
    try:
        today = date.today()

        todays_record = db.query(Score).filter(
            Score.created == today,
            Score.userid == uid
        ).first()

        if old_status == 3 and new_status != 3:
            completed_days_record = db.query(Score).filter(
                Score.userid == uid,
                Score.taskids.any(tid)
            ).first()

            if tid in completed_days_record.taskids:
                completed_days_record.taskids = list(set(completed_days_record.taskids) - {tid})
                completed_days_record.score -= PRIORITY_SCORES.get(old_priority)
                db.commit()

        elif old_status != 3 and new_status == 3:
            if tid not in todays_record.taskids:
                todays_record.taskids = (todays_record.taskids or []) + [tid]
                todays_record.score += PRIORITY_SCORES.get(new_priority)
                db.commit()

        elif old_status == 3 and new_status == 3:
            completed_days_record = db.query(Score).filter(
                Score.userid == uid,
                Score.taskids.any(tid)
            ).first()

            if tid in completed_days_record.taskids:
                completed_days_record.score -= PRIORITY_SCORES.get(old_priority)
                completed_days_record.score += PRIORITY_SCORES.get(new_priority)
                db.commit()

        max_score = db.query(func.max(Score.score)).filter(Score.userid == uid).scalar()
        user_record = db.query(User).filter(User.id == uid).first()
        user_record.bestscore = max_score
        db.commit()

    except Exception as e:
        print("Error:", e)



# Arranges the score stats for a user and returns it
def hf_return_score_info(db, current_user):
    today = date.today()
    weekday = today.weekday()  # 0 = Monday, 6 = Sunday

    todays_record = db.query(Score).filter(
        Score.userid == current_user.id,
        Score.created == today
    ).first()
    todays_score = todays_record.score if todays_record else 0

    monday = today - timedelta(days=weekday)
    week_scores_records = db.query(Score).filter(
        Score.userid == current_user.id,
        Score.created >= monday,
        Score.created <= today
    ).order_by(Score.created).all()

    this_week_scores = []
    for i in range(weekday + 1):
        day = monday + timedelta(days=i)
        day_record = next((r for r in week_scores_records if r.created == day), None)
        this_week_scores.append({
            "date": day.isoformat(),
            "score": day_record.score if day_record else 0
        })

    previous_weeks = []
    for w in range(1, 4):
        week_start = monday - timedelta(days=7*w)
        week_end = week_start + timedelta(days=6)
        week_total = db.query(func.sum(Score.score)).filter(
            Score.userid == current_user.id,
            Score.created >= week_start,
            Score.created <= week_end
        ).scalar() or 0
        previous_weeks.append({
            "week_start": week_start.isoformat(),
            "week_end": week_end.isoformat(),
            "score": week_total
        })

    result = {
        "today_score": todays_score,
        "this_week_scores": this_week_scores,
        "previous_weeks": previous_weeks
    }

    return result
