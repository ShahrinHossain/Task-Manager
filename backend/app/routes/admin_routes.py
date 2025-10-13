from app.admin_utils import *
from app.auth_utils import *
from fastapi import Depends, APIRouter
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin",
                   tags=["Admin related"])

# Gives the admins access to various stats
@router.get("/stats", status_code= status.HTTP_200_OK)
def admin_stats(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    stats = hf_admin_stats(db, current_admin)
    return stats

