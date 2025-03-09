CREATE PROCEDURE [dbo].[Get_User]
	@UserCreated UNIQUEIDENTIFIER = NULL,
	@SessionId UNIQUEIDENTIFIER = NULL,
	@UserId UNIQUEIDENTIFIER = NULL,
	@Page INT = NULL,
	@Filter VARCHAR(200) = NULL,
	@Rows INT OUT,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
BEGIN
	IF @SessionId IS NULL
	OR @UserCreated IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Parameter is required';
		RETURN;
	END

	IF NOT EXISTS (SELECT 1 FROM [Session] WHERE [SessionId] = @SessionId AND [UserId] = @UserCreated)
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid account';
		RETURN;
	END

	IF @UserId IS NOT NULL
	BEGIN
		SELECT
			A.[UserId],
			A.[Email],
			A.[FullName],
			A.[ProfileId],
			B.[ProfileName],
			A.[IsActive]
		FROM [User] A
		INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
		WHERE A.[UserId] = @UserId;
		RETURN;
	END

	IF @Page IS NOT NULL
	BEGIN
		IF @Filter IS NOT NULL
		BEGIN
			SELECT @Rows = COUNT(*)
			FROM [User] A
			INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
			WHERE A.[Email] != 'system'
			AND (A.[FullName] LIKE '%' + @Filter + '%'
			OR A.[Email] LIKE '%' + @Filter + '%'
			OR B.[ProfileName] LIKE '%' + @Filter + '%'); 

			SELECT
				A.[UserId],
				A.[Email],
				A.[FullName],
				A.[ProfileId],
				B.[ProfileName],
				A.[IsActive]
			FROM [User] A
			INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
			WHERE A.[Email] != 'system'
			AND (A.[FullName] LIKE '%' + @Filter + '%'
			OR A.[Email] LIKE '%' + @Filter + '%'
			OR B.[ProfileName] LIKE '%' + @Filter + '%')
			ORDER BY A.[FullName]
			OFFSET ((@Page - 1) * 10) ROWS
			FETCH NEXT 10 ROWS ONLY;
			
			RETURN;
		END

		SELECT @Rows = COUNT(*)
		FROM [User] A
		INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
		WHERE A.[Email] != 'system';

		SELECT
			A.[UserId],
			A.[Email],
			A.[FullName],
			A.[ProfileId],
			B.[ProfileName],
			A.[IsActive]
		FROM [User] A
		INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
		WHERE A.[Email] != 'system'
		ORDER BY A.[FullName]
		OFFSET ((@Page - 1) * 10) ROWS
		FETCH NEXT 10 ROWS ONLY;
	END
END
