"""Database configuration and session management."""
from __future__ import annotations
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.compiler import compiles
from pgvector.sqlalchemy import Vector
from app.config import get_settings

settings = get_settings()

# Compile pgvector Vector type to TEXT when using SQLite
@compiles(Vector, "sqlite")
def compile_vector_sqlite(element, compiler, **kw):
    return "TEXT"


if "sqlite" in settings.DATABASE_URL:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
else:
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
    )

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    """Dependency for getting async database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables. Safe for both PostgreSQL and SQLite."""
    async with engine.begin() as conn:
        if "postgresql" in settings.DATABASE_URL:
            try:
                await conn.execute(
                    __import__("sqlalchemy").text("CREATE EXTENSION IF NOT EXISTS vector")
                )
            except Exception as e:
                print(f"Notice: Could not create pgvector extension (may require superuser or already exists): {e}")
        await conn.run_sync(Base.metadata.create_all)
