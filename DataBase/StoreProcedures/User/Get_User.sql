CREATE PROCEDURE [dbo].[Get_User]
  @UserName VARCHAR(100) = NULL,
	@Password VARCHAR(150) = NULL,
	@UserId UNIQUEIDENTIFIER = NULL,
	@Page INT = NULL,
	@Filter VARCHAR(200) = NULL,
	@Rows INT OUT
AS
SET NOCOUNT ON;
BEGIN
	IF @UserId IS NOT NULL
	BEGIN
		SELECT
			A.[UserId],
			A.[Mail],
			A.[FullName],
			A.[UserName],
			A.[ProfileId],
			B.[ProfileName],
			A.[IsActive]
		FROM [User] A
		INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
		WHERE A.[UserId] = @UserId
		AND A.[IsActive] = 1;
		RETURN;
	END

	IF @UserName IS NOT NULL
	BEGIN
		IF @Password IS NOT NULL
		BEGIN
			SELECT
				A.[UserId],
				A.[Mail],
				A.[FullName],
				A.[UserName],
				A.[ProfileId],
				B.[ProfileName],
				A.[IsActive]
			FROM [User] A
			INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
			WHERE A.[UserName] = @UserName
			AND A.[Password] = @Password
			AND A.[IsActive] = 1;

			SELECT @Rows = @@ROWCOUNT;
			RETURN;
		END

		SELECT
			A.[UserId],
			A.[Mail],
			A.[FullName],
			A.[UserName],
			A.[ProfileId],
			B.[ProfileName],
			A.[IsActive]
		FROM [User] A
		INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
		WHERE A.[UserName] = @UserName
		AND A.[IsActive] = 1;

		SELECT @Rows = @@ROWCOUNT;
		RETURN;
	END

	IF @Page IS NOT NULL
	BEGIN
		IF @Filter IS NOT NULL
		BEGIN
			SELECT
				A.[UserId],
				A.[Mail],
				A.[FullName],
				A.[UserName],
				A.[ProfileId],
				B.[ProfileName],
				A.[IsActive]
			FROM [User] A
			INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
			WHERE A.[UserName] LIKE '%' + @Filter + '%'
			OR A.[FullName] LIKE '%' + @Filter + '%'
			OR A.[Mail] LIKE '%' + @Filter + '%'
			OR B.[ProfileName] LIKE '%' + @Filter + '%'
			ORDER BY A.[UserName]
			OFFSET (@Page * 10) ROWS
			FETCH NEXT 10 ROWS ONLY;
			
			SELECT @Rows = @@ROWCOUNT;
			RETURN;
		END

		SELECT
			A.[UserId],
			A.[Mail],
			A.[FullName],
			A.[UserName],
			A.[ProfileId],
			B.[ProfileName],
			A.[IsActive]
		FROM [User] A
		INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
		ORDER BY A.[UserName]
		OFFSET (@Page * 10) ROWS
		FETCH NEXT 10 ROWS ONLY;

		SELECT @Rows = @@ROWCOUNT;
	END
END
