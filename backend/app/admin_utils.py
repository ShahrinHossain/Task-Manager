from datetime import date, timedelta
from app.models import *

def hf_admin_stats(db, current_admin):
    try:
        today = date.today()
        one_month_ago = today - timedelta(days=30)

        all_users = db.query(User.id, User.name, User.email).all()
        all_users_list = [{"id": u.id, "name": u.name, "email": u.email} for u in all_users]

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
