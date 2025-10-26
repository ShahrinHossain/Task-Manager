from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd16336007927'
down_revision = '415153337ded'
branch_labels = None
depends_on = None


def upgrade():
    # Add target_date column to alltasks table with default today
    op.add_column(
        'alltasks',
        sa.Column(
            'target_date',
            sa.Date(),
            server_default=sa.text('CURRENT_DATE'),
            nullable=False
        )
    )


def downgrade():
    # Remove target_date column if we roll back
    op.drop_column('alltasks', 'target_date')
