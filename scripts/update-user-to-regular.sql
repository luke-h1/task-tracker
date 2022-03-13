
UPDATE "User"
SET user_type = 'REGULAR'
WHERE id = 2 
RETURNING *