from datetime import date, timedelta
from multiprocessing.sharedctypes import synchronized

from app.models import *

### Helper functions for admin_routes

# Returns all stats related to all users, top scorers, etc
def hf_admin_stats(db, current_admin):
    try:
        today = date.today()
        one_month_ago = today - timedelta(days=30)

        all_users = db.query(User.id, User.name, User.email, User.created).all()
        all_users_list = [{"id": u.id, "name": u.name, "email": u.email, "created": u.created} for u in all_users]

        users_logged_in_today = (
            db.query(User.id, User.name, User.email)
            .join(Score, Score.userid == User.id)
            .filter(Score.created == today)
            .distinct()
            .all()
        )
        logged_in_today_list = [{"id": u.id, "name": u.name, "email": u.email} for u in users_logged_in_today]

        active_last_month = db.query(Score.userid).filter(Score.created >= one_month_ago).distinct()
        inactive_users = db.query(User.id, User.name, User.email).filter(~User.id.in_(active_last_month)).all()
        inactive_users_list = [{"id": u.id, "name": u.name, "email": u.email} for u in inactive_users]

        top_users = db.query(User.id, User.name, User.email, User.bestscore).order_by(User.bestscore.desc()).limit(3).all()
        top_users_list = [{"id": u.id, "name": u.name, "email": u.email, "bestscore": u.bestscore} for u in top_users]

        todays_scores = db.query(Score.taskids).filter(Score.created == today).all()
        total_tasks_done_today = sum(len(s.taskids) if s.taskids else 0 for s in todays_scores)

        result = {
            "admin_email": current_admin.email,
            "all_users": all_users_list,
            "logged_in_today": logged_in_today_list,
            "inactive_users": inactive_users_list,
            "top_3_users": top_users_list,
            "total_tasks_done_today": total_tasks_done_today
        }
        return result
    except Exception as e:
        print("Error:", e)
        return {"message": "Error fetching stats"}


# Kicks an inactive user from the app
def hf_kick_user(uid, db, current_admin):
    try:
        deleted_user_query = db.query(User).filter(User.id == uid)
        deleted_user = deleted_user_query.first()
        if deleted_user:
            deleted_user_query.delete(synchronize_session=False)

            deleted_user_tasks_query = db.query(Task).filter(Task.userid == uid)
            deleted_user_tasks_query.delete(synchronize_session=False)

            deleted_user_scores_query = db.query(Score).filter(Score.userid == uid)
            deleted_user_scores_query.delete(synchronize_session=False)

            db.commit()
            return {"message": "User deletion successful"}
        else:
            return {"message": "No user found"}
    except Exception as e:
        print("Error:", e)
        return {"message": "An error has occurred"}
