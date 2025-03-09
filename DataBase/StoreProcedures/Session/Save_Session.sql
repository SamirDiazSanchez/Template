CREATE PROCEDURE [dbo].[Save_Session]
	@Email VARCHAR(150) = NULL,
	@FullName VARCHAR(100) OUT,
	@UserId UNIQUEIDENTIFIER OUT,
	@ProfileName VARCHAR(50) OUT,
	@Modules VARCHAR(MAX) OUT,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
	IF @Email IS NULL
	BEGIN
		SET @Code = 3;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	SELECT
		@UserId = A.[UserId],
		@ProfileName = B.[ProfileName],
		@FullName = A.[FullName],
		@Modules = B.[Modules]
	FROM [User] A
	INNER JOIN [Profile] B ON A.[ProfileId] = B.[ProfileId]
	WHERE A.[Email] = @Email
	AND A.[IsActive] = 1;

	-- CREATE SESSION
	BEGIN TRANSACTION
	BEGIN TRY
		SET @Id = NEWID();

		INSERT INTO [SessionHistory] (
			[SessionId],
			[UserId],
			[Created],
			[Closed]
		)
		SELECT
			A.[SessionId],
			A.[UserId],
			A.[Created],
			@currentDate
		FROM [Session] A
		WHERE [UserId] = @UserId;
		
		DELETE [Session]
		WHERE [UserId] = @UserId;

		INSERT INTO [Session]
		(
			[SessionId],
			[UserId],
			[Created]
		)
		VALUES
		(
			@Id,
			@UserId,
			@currentDate
		);

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
