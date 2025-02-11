CREATE PROCEDURE [dbo].[Delete_User]
  @UserId UNIQUEIDENTIFIER = NULL,
	@UserUpdated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN

	IF @UserUpdated IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	IF @UserId IS NULL
	BEGIN
		SET @Code = 2;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		UPDATE [User]
		SET [UserUpdated] = @UserUpdated,
			[Updated] = @currentDate,
			[IsActive] = 0
		WHERE [UserId] = @UserId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
