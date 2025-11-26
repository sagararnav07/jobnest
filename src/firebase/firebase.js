import api, { setAuthToken, unwrap } from "../lib/api";

export const createAuthUserWithEmailAndPassword = async (
  email,
  password,
  displayName,
  photoURL,
  additional = {}
) => {
  const payload = {
    email,
    password,
    displayName,
    photoURL,
    ...additional,
  };
  const data = await unwrap(api.post("/auth/register", payload));
  setAuthToken(data.token);
  return data;
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  const data = await unwrap(api.post("/auth/login", { email, password }));
  setAuthToken(data.token);
  return data;
};

export const signOutUser = async () => {
  await unwrap(api.post("/auth/logout"));
  setAuthToken(null);
};

export const forgetPassword = async (email) => {
  await unwrap(api.post("/auth/forgot-password", { email }));
  return true;
};

export const getUserDocument = async () => {
  const data = await unwrap(api.get("/users/me"));
  return data.user;
};

export const updateUserDocument = async (updatedData) => {
  const data = await unwrap(api.patch("/users/me", updatedData));
  return data.user;
};

export const getCompanyUsers = async () => {
  const data = await unwrap(
    api.get("/users/companies", { params: { verified: true } })
  );
  return data.companies;
};

export const getCompanyUserById = async (userId) => {
  const data = await unwrap(api.get(`/users/companies/${userId}`));
  return { id: data.company._id, ...data.company };
};

export const getChatUsers = async () => {
  const data = await unwrap(api.get("/users/chat/users"));
  return data.users.map((user) => ({ id: user._id, ...user }));
};

export const getChatUserById = async (userId) => {
  const data = await unwrap(api.get(`/users/${userId}`));
  return { id: data.user._id, ...data.user };
};

export const postJob = async (jobData) => {
  const data = await unwrap(api.post("/jobs", jobData));
  return { id: data.job._id, ...data.job };
};

const mapJobResponse = (job) => ({
  id: job._id,
  job: {
    title: job.title,
    description: job.description,
    type: job.type,
    experienceLevel: job.experienceLevel,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    salary: job.salary,
    applicationDeadline: job.applicationDeadline,
    searchKeywords: job.searchKeywords,
  },
  company: job.company,
});

export const getJob = async (params = {}) => {
  const data = await unwrap(api.get("/jobs", { params }));
  return data.jobs.map(mapJobResponse);
};

export const getJobByUserEmail = async (email) => {
  const data = await unwrap(api.get("/jobs", { params: { companyEmail: email } }));
  return data.jobs.map(mapJobResponse);
};

export const getJobById = async (jobId) => {
  const data = await unwrap(api.get(`/jobs/${jobId}`));
  return mapJobResponse(data.job);
};

export const deleteJobById = async (jobId) => {
  await unwrap(api.delete(`/jobs/${jobId}`));
  return true;
};

export const getJobByTitle = async (jobTitle) => {
  if (!jobTitle) return getJob();
  const data = await unwrap(api.get("/jobs", { params: { search: jobTitle } }));
  return data.jobs.map(mapJobResponse);
};

export const getJobFilter = async (sectionId, optionValue) => {
  const data = await unwrap(
    api.get("/jobs", { params: { [sectionId]: optionValue } })
  );
  return data.jobs.map(mapJobResponse);
};

export const getJobByUserEmailReport = getJobByUserEmail;

export const sendMessage = async ({ receiverEmail, message }) => {
  const data = await unwrap(
    api.post("/messages", {
      receiverEmail,
      message,
    })
  );
  return data.message;
};

export const getConversation = async (participantEmail) => {
  const data = await unwrap(
    api.get("/messages", { params: { participantEmail } })
  );
  return data.messages;
};

export const createReview = async (newReview) => {
  const data = await unwrap(api.post("/reviews", newReview));
  return { id: data.review._id, ...data.review };
};

export const deleteReview = async (reviewId) => {
  await unwrap(api.delete(`/reviews/${reviewId}`));
};

export const getReviewsByEmail = async (email) => {
  const data = await unwrap(api.get("/reviews", { params: { email } }));
  return data.reviews.map((review) => ({ id: review._id, ...review }));
};

export const getReviewsByEmailReport = async (email) => {
  const data = await unwrap(api.get(`/reviews/user/${email}`));
  return data.reviews.map((review) => ({ id: review._id, ...review }));
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const data = await unwrap(
    api.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
  return data;
};