import AppError from "./AppError.js";

const errorMessages = {
  400: {
    default: "Bad request.",
    cannotMake:"Can't make this action",
    missingFields: "All fields are required.",
    imageOrVideo:"You must upload at least an image, a video, or both.",
    invalidCategories: "Some categories do not exist in the system.",
    invalidId: "Invalid ID format.",
    invalidUserId: "Invalid user ID.",
    invalidPostId: "Invalid post ID.",
    missingEmail: "Email is required.",
    missingPassword: "Password is required.",
    invalidnotificationId:"Invalid notification ID",
    missingGoogleToken:"Missing google token",
    imageRequired: "Image is required.",
    postIsLiked: "Post is already liked",
    postIsUnLiked: "Post is already unliked",
    commentIsNotInPost: "Comment doesn't belong to the post",
    cannotUnfollowSelf: "Cannot unfollow yourself",
    cannotFollowSelf: "Cannot follow yourself",
    alreadyNotFollowing:"You are already not following this user",
    alreadyFollowing:"You are already following this user",
    searchQuery:"Search query is required",
    noToken:"Token is required",
    invalidToken:"Invalid or expired token",
    usernamealreadyTaken:"Username is already taken",
    alreadyVerified:"Email already verified",
    alreadySubscribed:"User already subscribed",
    WalletNumber:"Wallet number is already in use. Please choose a different one.",
    missingCategories:"missing categories",
    InvalidEmail: "Invalid email format",
    alreadyRegisteredYourIntent:"You have already registered your intent for this post",
    imageOrThumbnail:"You must upload an image or a thumbnail",
    missingGoogleCredentials:"Missing google credentials",
  },
  401: {
    default: "Unauthorized. Please log in again.",
    token: "token expired. Please log in again.",
    CurrentPassword: "Password is incorrect.",
    Invalidcardinalities: "Invalid email or password. Please try again.",
  },
  403: {
    default: "Forbidden.",
    notAuthenticated:"Forbidden: You must be logged in to perform this action.",
    notAuthorized: "Forbidden: You are not authorized to update this post",
    notCommentAuth: "User is not authorized to delete the comment",
    notBusinessOwner:"Forbidden: You must be a business owner to perform this action.",
    verifyEmail:"Please verify your email",
    isBusinessOwner:"Business owner can't create a post"
  },
  404: {
    default: "Not found.",
    user: "User not found.",
    resource: "Resource not found.",
    products: "No products found.",
    Photo: "Photo not found",
    post: "Post not found",
    comment: "Comment not found",
    matchingPosts:"No matching posts found",
    notification:"Notification not found",
    BusinessName:"BusinessName not found",
    approval:"Approval URL not found",
    order:"Order not found",
  },
  409: {
    default: "Conflict.",
    userExists: "Email or username already in use",
    InvalidCredentials: "Invalid credentials or data",
    businessOwnerExists: "Email or businessName already in use",
  },
  500: {
    default: "Conflict.",
    socketError:"Socket.IO is not initialized!",
    hashingError:
      "An error occurred while securing your password. Please try again later.",
    compareError:
      "An error occurred while verifying your password. Please try again later.",
      emailSendFailed:"Email send failed",
      googleLoginError:"Google login failed",
  },

  default: "An error occurred.",
};

const sendError = (statusCode, context = "") => {
  const statusMessages = errorMessages[statusCode] || {};
  const message =
    statusMessages[context] || statusMessages.default || errorMessages.default;

  return new AppError(message, statusCode);
};

export default sendError;
