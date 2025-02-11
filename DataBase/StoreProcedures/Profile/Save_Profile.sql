CREATE PROCEDURE [dbo].[Save_Profile]
 	@ProfileName VARCHAR(50) = NULL,
	@ModuleIds VARCHAR(MAX) = NULL,
	@UserCreated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
	-- Control parameters
	IF @UserCreated IS NULL
	OR NOT EXISTS (SELECT [UserId] FROM [User] WHERE [UserId] = @UserCreated)
	BEGIN
		SET @Code = 1;
		SET @Message = 'Required parameter';
		RETURN;
	END

	-- Content parameters
	IF @ProfileName IS NULL
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	-- Duplicate registers
	IF EXISTS (SELECT [ProfileId] FROM[Profile] WHERE [ProfileName] = @ProfileName)
	OR @ModuleIds IS NULL
	BEGIN
		SET @Code = 3;
		SET @Message = 'Duplicate record';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		SET @Id = NEWID();

		INSERT INTO [Profile]
		(
			[ProfileId],
			[ProfileName],
			[Created],
			[Updated],
			[UserCreated],
			[UserUpdated]
		)
		VALUES
		(
			@Id,
			@ProfileName,
			@currentDate,
			@currentDate,
			@UserCreated,
			@UserCreated
		);

		INSERT INTO [Profile_Module]
		(
			[ModuleId],
			[ProfileId],
			[UserCreated],
			[UserUpdated],
			[Created],
			[Updated]
		)
		SELECT
			VALUE,
			@Id,
			@UserCreated,
			@UserCreated,
			@currentDate,
			@currentDate
		FROM STRING_SPLIT(@ModuleIds, ',');

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END