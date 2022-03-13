UPDATE "User"
SET user_type = 'ADMIN'
WHERE id = 2 
RETURNING *
