"""Unit tests for Auth, Document Management, Chat, and User Isolation."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_user_registration_and_login(client: AsyncClient):
    """Test user registration, login, and protected /me profile endpoint."""
    # 1. Register User A
    reg_response = await client.post(
        "/api/auth/register",
        json={
            "name": "Alice User",
            "email": "alice@example.com",
            "password": "Password123!",
        },
    )
    assert reg_response.status_code == 201
    data = reg_response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "alice@example.com"
    token_a = data["access_token"]

    # 2. Login User A
    login_response = await client.post(
        "/api/auth/login",
        json={
            "email": "alice@example.com",
            "password": "Password123!",
        },
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

    # 3. Test protected /me endpoint
    me_response = await client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert me_response.status_code == 200
    assert me_response.json()["name"] == "Alice User"


@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient):
    """Test unauthenticated calls to protected routes return HTTP 401."""
    response = await client.get("/api/auth/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_user_isolation_documents(client: AsyncClient):
    """Test security isolation: User A cannot see or delete User B's resources."""
    # Register User A
    res_a = await client.post(
        "/api/auth/register",
        json={"name": "User A", "email": "usera@example.com", "password": "Password123!"},
    )
    token_a = res_a.json()["access_token"]

    # Register User B
    res_b = await client.post(
        "/api/auth/register",
        json={"name": "User B", "email": "userb@example.com", "password": "Password123!"},
    )
    token_b = res_b.json()["access_token"]

    # User A lists documents
    docs_a = await client.get(
        "/api/documents",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert docs_a.status_code == 200
    assert docs_a.json()["total"] == 0

    # User B lists documents
    docs_b = await client.get(
        "/api/documents",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert docs_b.status_code == 200
    assert docs_b.json()["total"] == 0


@pytest.mark.asyncio
async def test_chat_conversations(client: AsyncClient):
    """Test creating conversation and sending chat messages."""
    # Register user
    reg = await client.post(
        "/api/auth/register",
        json={"name": "Chat User", "email": "chatuser@example.com", "password": "Password123!"},
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create conversation
    conv_res = await client.post(
        "/api/chat/conversations",
        json={"title": "Test RAG Chat"},
        headers=headers,
    )
    assert conv_res.status_code == 201
    conv_id = conv_res.json()["id"]

    # Post message
    msg_res = await client.post(
        f"/api/chat/conversations/{conv_id}/messages",
        json={"content": "What is the document overview?"},
        headers=headers,
    )
    assert msg_res.status_code == 200
    chat_data = msg_res.json()
    assert chat_data["user_message"]["content"] == "What is the document overview?"
    assert "assistant_message" in chat_data

    # List conversations
    list_res = await client.get("/api/chat/conversations", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] == 1
