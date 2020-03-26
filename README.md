# Back-End

# Required Post Deployment Checklist
- Make sure your secrets are pre-created and populated properly from the UI
- Values and Secrets (update db-name value appropriately)
- Users -> Custom User Data -> [cluster: mongodb-atlas, db: *choose db*, collection name: user_data, "User ID Field"L user_id]
-- Triggers -> newOrderTrigger -> select cluster, db, collection.