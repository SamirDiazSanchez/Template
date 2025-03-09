CREATE PROCEDURE [dbo].[Get_Profile]
	@SessionId UNIQUEIDENTIFIER = NULL,
	@UserCreated UNIQUEIDENTIFIER = NULL,
 	@IsActive BIT = NULL,
	@Filter VARCHAR(100) = NULL,
	@Page INT = NULL,
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

	IF @IsActive IS NOT NULL
	BEGIN
		SELECT
			A.[ProfileId],
			A.[ProfileName],
			A.[Modules],
			A.[Created],
			A.[Updated],
			A.[UserCreated],
			A.[UserUpdated],
			A.[IsActive]
		FROM [Profile] A
		WHERE A.[IsActive] = 1;
		
		SELECT @Rows = @@ROWCOUNT;
		RETURN;
	END
	
	IF @Page IS NOT NULL
	BEGIN
		IF @Filter IS NOT NULL
		BEGIN
			SELECT @Rows = COUNT(*)
			FROM [Profile] A
			WHERE (
				A.[Modules] LIKE '%' + @Filter + '%'
				OR A.[ProfileName] LIKE '%' + @Filter + '%'
			);

			SELECT
				A.[ProfileId],
				A.[ProfileName],
				A.[Created],
				A.[Updated],
				A.[UserCreated],
				A.[UserUpdated],
				A.[IsActive]
			FROM [Profile] A
			WHERE (
				A.[Modules] LIKE '%' + @Filter + '%'
				OR A.[ProfileName] LIKE '%' + @Filter + '%'
			)
			ORDER BY A.[ProfileName]
			OFFSET ((@Page - 1) * 10) ROWS
			FETCH NEXT 10 ROWS ONLY;
			RETURN;
		END

		SELECT @Rows = COUNT(*)
		FROM [Profile] A;

		SELECT
			A.[ProfileId],
			A.[ProfileName],
			A.[Modules],
			A.[Created],
			A.[Updated],
			A.[UserCreated],
			A.[UserUpdated],
			A.[IsActive]
		FROM [Profile] A
		ORDER BY A.[ProfileName]
		OFFSET ((@Page - 1) * 10) ROWS
		FETCH NEXT 10 ROWS ONLY;
	END
END
