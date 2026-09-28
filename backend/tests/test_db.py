from sqlalchemy.orm import Session

from app.db import get_session


def test_get_session_yields_and_closes_session():
    gen = get_session()
    session = next(gen)
    assert isinstance(session, Session)
    gen.close()
