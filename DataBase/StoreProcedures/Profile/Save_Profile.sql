CREATE PROCEDURE [dbo].[Save_Profile]
	@SessionId UNIQUEIDENTIFIER = NULL,
 	@ProfileName VARCHAR(50) = NULL,
	@Modules VARCHAR(MAX) = NULL,
	@UserCreated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
	-- CONTROLE PARAMETERS
	IF @SessionId IS NULL
	OR @UserCreated IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Parameter is required';
		RETURN;
	END

	-- VALIDATE ACCOUNT
	IF NOT EXISTS (SELECT 1 FROM [Session] WHERE [SessionId] = @SessionId AND [UserId] = @UserCreated)
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid account';
		RETURN;
	END

	-- VALIDATE PARAMETER
	IF @ProfileName IS NULL
	OR EXISTS (SELECT [ProfileId] FROM[Profile] WHERE [ProfileName] = @ProfileName)
	OR @Modules IS NULL
	BEGIN
		SET @Code = 3;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		SET @Id = NEWID();

		INSERT INTO [Profile]
		(
			[ProfileId],
			[ProfileName],
			[Modules],
			[Created],
			[Updated],
			[UserCreated],
			[UserUpdated]
		)
		VALUES
		(
			@Id,
			@ProfileName,
			@Modules,
			@currentDate,
			@currentDate,
			@UserCreated,
			@UserCreated
		);

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END