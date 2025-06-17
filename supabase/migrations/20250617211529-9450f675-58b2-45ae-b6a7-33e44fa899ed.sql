
-- First, let's see what duplicates we have
WITH duplicate_files AS (
  SELECT 
    file_name,
    COUNT(*) as count,
    MIN(uploaded_at) as first_upload,
    MAX(uploaded_at) as last_upload
  FROM documents 
  GROUP BY file_name 
  HAVING COUNT(*) > 1
)
SELECT * FROM duplicate_files;

-- Remove duplicate documents, keeping only the most recent version of each file
DELETE FROM documents 
WHERE id IN (
  SELECT id FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY file_name 
        ORDER BY uploaded_at DESC
      ) as rn
    FROM documents
  ) ranked
  WHERE rn > 1
);

-- Verify the cleanup by checking remaining documents
SELECT 
  file_name,
  COUNT(*) as count,
  MAX(uploaded_at) as kept_version
FROM documents 
GROUP BY file_name 
ORDER BY file_name;
