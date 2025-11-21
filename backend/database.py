"""
Simple in-memory database for now.
Using Python dictionaries to store data.
Easy to migrate to real DB later (MongoDB, PostgreSQL, etc.)
"""

from typing import Dict, List
from datetime import datetime
import json
import os

class Database:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
        
        self.citizens_file = os.path.join(data_dir, "citizens.json")
        self.officials_file = os.path.join(data_dir, "officials.json")
        self.applications_file = os.path.join(data_dir, "applications.json")
        self.messages_file = os.path.join(data_dir, "messages.json")
        
        # Load existing data or initialize
        self.citizens: Dict = self._load_json(self.citizens_file, {})
        self.officials: Dict = self._load_json(self.officials_file, {})
        self.applications: Dict = self._load_json(self.applications_file, {})
        self.messages: Dict = self._load_json(self.messages_file, {})
        
        # Combine for legacy user methods
        self.users: Dict = {**self.citizens, **self.officials}
    
    def _load_json(self, filepath: str, default: any) -> any:
        """Load JSON file or return default"""
        try:
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
        return default
    
    def _save_json(self, filepath: str, data: any):
        """Save data to JSON file"""
        try:
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving {filepath}: {e}")
    
    # User operations
    def create_user(self, user_data: dict) -> dict:
        """Create a new user"""
        user_id = user_data['id']
        user_type = user_data.get('user_type', 'citizen')
        
        if user_type == 'official':
            self.officials[user_id] = user_data
            self._save_json(self.officials_file, self.officials)
        else:
            self.citizens[user_id] = user_data
            self._save_json(self.citizens_file, self.citizens)
        
        # Update combined dict
        self.users[user_id] = user_data
        return user_data
    
    def get_user_by_email(self, email: str) -> dict:
        """Get user by email"""
        for user in self.users.values():
            if user.get('email') == email:
                return user
        return None
    
    def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        return self.users.get(user_id)
    
    def get_all_users(self) -> List[dict]:
        """Get all users"""
        # Reload to ensure we have latest data
        self.citizens = self._load_json(self.citizens_file, {})
        self.officials = self._load_json(self.officials_file, {})
        self.users = {**self.citizens, **self.officials}
        return list(self.users.values())
    
    # Application operations
    def create_application(self, app_data: dict) -> dict:
        """Create a new application"""
        self.applications[app_data['id']] = app_data
        self._save_json(self.applications_file, self.applications)
        return app_data
    
    def get_application_by_id(self, app_id: str) -> dict:
        """Get application by ID"""
        return self.applications.get(app_id)
    
    def update_application(self, app_id: str, updates: dict) -> dict:
        """Update an application"""
        if app_id in self.applications:
            self.applications[app_id].update(updates)
            self._save_json(self.applications_file, self.applications)
            return self.applications[app_id]
        return None
    
    def delete_application(self, app_id: str) -> bool:
        """Delete an application"""
        if app_id in self.applications:
            del self.applications[app_id]
            self._save_json(self.applications_file, self.applications)
            return True
        return False
    
    def get_applications_by_user(self, user_id: str) -> List[dict]:
        """Get all applications for a user"""
        return [app for app in self.applications.values() if app.get('user_id') == user_id]
    
    def get_applications_by_office(self, office_level: str, office_name: str) -> List[dict]:
        """Get all applications for a specific office"""
        return [
            app for app in self.applications.values()
            if app.get('target_office_level') == office_level and 
               app.get('target_office_name') == office_name
        ]
    
    def get_all_applications(self) -> List[dict]:
        """Get all applications"""
        return list(self.applications.values())
    
    # Message operations
    def create_message(self, message_data: dict) -> dict:
        """Create a new message"""
        self.messages[message_data['id']] = message_data
        self._save_json(self.messages_file, self.messages)
        return message_data
    
    def get_message_by_id(self, message_id: str) -> dict:
        """Get message by ID"""
        return self.messages.get(message_id)
    
    def get_messages_for_user(self, user_id: str) -> List[dict]:
        """Get all messages for a user (sent or received)"""
        return [msg for msg in self.messages.values() 
                if msg.get('recipient_id') == user_id or msg.get('sender_id') == user_id]
    
    def get_received_messages(self, user_id: str) -> List[dict]:
        """Get messages received by a user"""
        return [msg for msg in self.messages.values() if msg.get('recipient_id') == user_id]
    
    def get_sent_messages(self, user_id: str) -> List[dict]:
        """Get messages sent by a user"""
        return [msg for msg in self.messages.values() if msg.get('sender_id') == user_id]
    
    def mark_message_read(self, message_id: str) -> dict:
        """Mark a message as read"""
        if message_id in self.messages:
            self.messages[message_id]['read'] = True
            self._save_json(self.messages_file, self.messages)
            return self.messages[message_id]
        return None

# Global database instance
db = Database()

