# Back-End

# Deployment 
### Run from project root.
stitch-cli import \
  --app-id=stayneighbor_dev-nszik \
  --strategy=replace \
  --include-hosting \
  --include-dependencies

# Required Post Deployment Checklist
- Make sure your secrets are pre-created and populated properly from the UI
- Values and Secrets (update db-name value appropriately)
- Fix Custom user Data Config:
    - Navigate to: Users -> Custom User Data 
    - Update fields as follows: [cluster: mongodb-atlas, db: *choose db*, collection name: user_data, "User ID Field" user_id]
- Fix New Order Trigger Config
    - Navigate to: Triggers -> newOrderTrigger 
    - Update appropriate cluster and database name and collection.
- Review and deploy changes made in UI.