import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { ApprovalStatus } from "@/api/user";

/**
 * User Management Hooks
 */

export function useFetchUsers(filters?: { status?: ApprovalStatus }) {
  return useQuery({
    queryKey: api.user.fetchAll.$use(filters),
    queryFn: () => api.$use.user.fetchAll(filters),
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationKey: api.user.update.$get(),
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      api.$use.user.update(userId, updates),
    meta: {
      errorMessage: "Failed to update user.",
      successMessage: "User updated successfully.",
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationKey: api.user.create.$get(),
    mutationFn: api.$use.user.create,
    meta: {
      errorMessage: "Failed to create user. Please try again.",
      successMessage: "User created successfully.",
    },
  });
}

export function useCurrentUser() {
  return useMutation({
    mutationKey: api.user.fetch.$get(),
    mutationFn: api.$use.user.fetch,
    meta: {
      errorMessage: "Failed to fetch current user data.",
      successMessage: "User data fetched successfully.",
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: api.user.login.$get(),
    mutationFn: api.$use.user.login,
    meta: {
      errorMessage: "Login failed. Please try again.",
      successMessage: "Logged in successfully.",
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: api.user.resetPassword.$get(),
    mutationFn: api.$use.user.resetPassword,
    meta: {
      errorMessage: "Failed to send reset email. Please try again.",
      successMessage: "Reset email sent successfully.",
    },
  });
}

/**
 * Mandate Management Hooks
 */

export function useCreateMandate() {
  return useMutation({
    mutationKey: api.mandate.create.$get(),
    mutationFn: api.$use.mandate.create,
    meta: {
      errorMessage: "Failed to create mandate. Please try again.",
      successMessage: "Mandate created successfully.",
    },
  });
}

export function useSyncMandateStatus() {
  return useMutation({
    mutationKey: api.mandate.syncStatus.$get(),
    mutationFn: api.$use.mandate.syncStatus,
    meta: {
      errorMessage: "Failed to sync mandate status.",
      successMessage: "Mandate status synced successfully.",
    },
  });
}

export function useDebitMandate() {
  return useMutation({
    mutationKey: api.mandate.debit.$get(),
    mutationFn: api.$use.mandate.debit,
    meta: {
      errorMessage: "Failed to process payment.",
      successMessage: "Payment processed successfully.",
    },
  });
}

export function useFetchMandate(mandateId: string) {
  return useQuery({
    queryKey: api.mandate.fetch.$use(mandateId),
    queryFn: () => api.$use.mandate.fetch(mandateId),
    enabled: !!mandateId,
  });
}

export function useFetchUserMandates(userId: string) {
  return useQuery({
    queryKey: api.mandate.fetchByUserId.$use(userId),
    queryFn: () => api.$use.mandate.fetchByUserId(userId),
    enabled: !!userId,
  });
}

export function useFetchActiveMandate(userId: string) {
  return useQuery({
    queryKey: api.mandate.getActive.$use(userId),
    queryFn: () => api.$use.mandate.getActive(userId),
    enabled: !!userId,
  });
}

export function usePauseMandate() {
  return useMutation({
    mutationKey: api.mandate.pause.$get(),
    mutationFn: api.$use.mandate.pause,
    meta: {
      errorMessage: "Failed to pause mandate.",
      successMessage: "Mandate paused successfully.",
    },
  });
}

export function useCancelMandate() {
  return useMutation({
    mutationKey: api.mandate.cancel.$get(),
    mutationFn: api.$use.mandate.cancel,
    meta: {
      errorMessage: "Failed to cancel mandate.",
      successMessage: "Mandate cancelled successfully.",
    },
  });
}

export function useReinstateMandate() {
  return useMutation({
    mutationKey: api.mandate.reinstate.$get(),
    mutationFn: api.$use.mandate.reinstate,
    meta: {
      errorMessage: "Failed to reinstate mandate.",
      successMessage: "Mandate reinstated successfully.",
    },
  });
}

export function useFetchMandateTransactions(mandateId: string) {
  return useQuery({
    queryKey: api.mandate.fetchTransactions.$use(mandateId),
    queryFn: () => api.$use.mandate.fetchTransactions(mandateId),
    enabled: !!mandateId,
  });
}

export function useFetchUserTransactions(userId: string) {
  return useQuery({
    queryKey: api.mandate.fetchUserTransactions.$use(userId),
    queryFn: () => api.$use.mandate.fetchUserTransactions(userId),
    enabled: !!userId,
  });
}

/**
 * Payment Partner Hooks
 */

export function useCreatePaymentPartner() {
  return useMutation({
    mutationKey: api.paymentPartner.create.$get(),
    mutationFn: api.$use.paymentPartner.create,
    meta: {
      errorMessage: "Failed to create payment partner.",
      successMessage: "Payment partner created successfully.",
    },
  });
}

export function useFetchPaymentPartners() {
  return useQuery({
    queryKey: api.paymentPartner.fetchAll.$use(),
    queryFn: () => api.$use.paymentPartner.fetchAll(),
  });
}

export function useFetchClientPartner() {
  return useQuery({
    queryKey: api.paymentPartner.getClient.$use(),
    queryFn: () => api.$use.paymentPartner.getClient(),
  });
}

export function useFetchPlatformPartner() {
  return useQuery({
    queryKey: api.paymentPartner.getPlatform.$use(),
    queryFn: () => api.$use.paymentPartner.getPlatform(),
  });
}

/**
 * Event Management Hooks
 */

export function useFetchEvents(filters?: {
  type?: "convention" | "seminar" | "iftar" | "sports" | "dawah" | "other";
  upcoming?: boolean;
}) {
  return useQuery({
    queryKey: api.event.fetchAll.$use(filters),
    queryFn: () => api.$use.event.fetchAll(filters),
  });
}

export function useFetchEvent(eventId: string) {
  return useQuery({
    queryKey: api.event.fetchById.$use(eventId),
    queryFn: () => api.$use.event.fetchById(eventId),
    enabled: !!eventId,
  });
}

export function useCreateEvent() {
  return useMutation({
    mutationKey: api.event.create.$get(),
    mutationFn: api.$use.event.create,
    meta: {
      errorMessage: "Failed to create event.",
      successMessage: "Event created successfully.",
    },
  });
}

export function useRegisterForEvent() {
  return useMutation({
    mutationKey: api.event.register.$get(),
    mutationFn: api.$use.event.register,
    meta: {
      errorMessage: "Failed to register for event.",
      successMessage: "Registered successfully!",
    },
  });
}

export function useFetchUserEvents(userId: string) {
  return useQuery({
    queryKey: api.event.fetchUserEvents.$use(userId),
    queryFn: () => api.$use.event.fetchUserEvents(userId),
    enabled: !!userId,
  });
}

export function useCheckEventRegistration(eventId: string, userId: string) {
  return useQuery({
    queryKey: api.event.isUserRegistered.$use(eventId, userId),
    queryFn: () => api.$use.event.isUserRegistered(eventId, userId),
    enabled: !!eventId && !!userId,
  });
}

export function useUpdateEvent() {
  return useMutation({
    mutationKey: api.event.update.$get(),
    mutationFn: ({ eventId, updates }: { eventId: string; updates: any }) =>
      api.$use.event.update(eventId, updates),
    meta: {
      errorMessage: "Failed to update event.",
      successMessage: "Event updated successfully.",
    },
  });
}

export function useDeleteEvent() {
  return useMutation({
    mutationKey: api.event.delete.$get(),
    mutationFn: (eventId: string) => api.$use.event.delete(eventId),
    meta: {
      errorMessage: "Failed to delete event.",
      successMessage: "Event deleted successfully.",
    },
  });
}

/**
 * Newsletter Hooks
 */

export function useSubscribeNewsletter() {
  return useMutation({
    mutationKey: api.newsletter.subscribe.$get(),
    mutationFn: api.$use.newsletter.subscribe,
    meta: {
      errorMessage: "Failed to subscribe to newsletter.",
      successMessage: "Successfully subscribed to newsletter!",
    },
  });
}

export function useUnsubscribeNewsletter() {
  return useMutation({
    mutationKey: api.newsletter.unsubscribe.$get(),
    mutationFn: api.$use.newsletter.unsubscribe,
    meta: {
      errorMessage: "Failed to unsubscribe.",
      successMessage: "Successfully unsubscribed from newsletter.",
    },
  });
}

export function useFetchNewsletterIssues() {
  return useQuery({
    queryKey: api.newsletter.fetchIssues.$use(),
    queryFn: () => api.$use.newsletter.fetchIssues(),
  });
}

export function useFetchNewsletterIssue(issueId: string) {
  return useQuery({
    queryKey: api.newsletter.fetchIssueById.$use(issueId),
    queryFn: () => api.$use.newsletter.fetchIssueById(issueId),
    enabled: !!issueId,
  });
}

export function useCreateNewsletterIssue() {
  return useMutation({
    mutationKey: api.newsletter.createIssue.$get(),
    mutationFn: api.$use.newsletter.createIssue,
    meta: {
      errorMessage: "Failed to create newsletter issue.",
      successMessage: "Newsletter issue created successfully.",
    },
  });
}

/**
 * Article/Bulletin Hooks
 */

export function useFetchArticles(filters?: {
  category?: "news" | "health" | "islamic" | "campus" | "alumni" | "community";
  isPublished?: boolean;
  tag?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: api.article.fetchAll.$use(filters),
    queryFn: () => api.$use.article.fetchAll(filters),
  });
}

export function useFetchArticle(articleId: string) {
  return useQuery({
    queryKey: api.article.fetchById.$use(articleId),
    queryFn: () => api.$use.article.fetchById(articleId),
    enabled: !!articleId,
  });
}

export function useFetchArticleBySlug(slug: string) {
  return useQuery({
    queryKey: api.article.fetchBySlug.$use(slug),
    queryFn: () => api.$use.article.fetchBySlug(slug),
    enabled: !!slug,
  });
}

export function useFetchRelatedArticles(
  articleId: string,
  maxResults?: number
) {
  return useQuery({
    queryKey: api.article.fetchRelated.$use(articleId, maxResults),
    queryFn: () => api.$use.article.fetchRelated(articleId, maxResults),
    enabled: !!articleId,
  });
}

export function useSearchArticles(searchQuery: string) {
  return useQuery({
    queryKey: api.article.search.$use(searchQuery),
    queryFn: () => api.$use.article.search(searchQuery),
    enabled: searchQuery.length > 2,
  });
}

export function useCreateArticle() {
  return useMutation({
    mutationKey: api.article.create.$get(),
    mutationFn: api.$use.article.create,
    meta: {
      errorMessage: "Failed to create article.",
      successMessage: "Article created successfully.",
    },
  });
}

export function useUpdateArticle() {
  return useMutation({
    mutationKey: api.article.update.$get(),
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.$use.article.update(id, data),
    meta: {
      errorMessage: "Failed to update article.",
      successMessage: "Article updated successfully.",
    },
  });
}

export function useDeleteArticle() {
  return useMutation({
    mutationKey: api.article.delete.$get(),
    mutationFn: (id: string) => api.$use.article.delete(id),
    meta: {
      errorMessage: "Failed to delete article.",
      successMessage: "Article deleted successfully.",
    },
  });
}

/**
 * Gallery Hooks
 */

export function useFetchGalleryCollections(filters?: {
  year?: string;
  category?: string;
  isFeatured?: boolean;
}) {
  return useQuery({
    queryKey: api.gallery.fetchCollections.$use(filters),
    queryFn: () => api.$use.gallery.fetchCollections(filters),
  });
}

export function useFetchGalleryCollection(collectionId: string) {
  return useQuery({
    queryKey: api.gallery.fetchCollectionById.$use(collectionId),
    queryFn: () => api.$use.gallery.fetchCollectionById(collectionId),
    enabled: !!collectionId,
  });
}

export function useFetchGalleryMedia(collectionId: string) {
  return useQuery({
    queryKey: api.gallery.fetchMedia.$use(collectionId),
    queryFn: () => api.$use.gallery.fetchMedia(collectionId),
    enabled: !!collectionId,
  });
}

export function useCreateGalleryCollection() {
  return useMutation({
    mutationKey: api.gallery.createCollection.$get(),
    mutationFn: api.$use.gallery.createCollection,
    meta: {
      errorMessage: "Failed to create gallery collection.",
      successMessage: "Gallery collection created successfully.",
    },
  });
}

export function useAddGalleryMedia() {
  return useMutation({
    mutationKey: api.gallery.addMedia.$get(),
    mutationFn: api.$use.gallery.addMedia,
    meta: {
      errorMessage: "Failed to add media to gallery.",
      successMessage: "Media added successfully.",
    },
  });
}

export function useUploadGalleryImage() {
  return useMutation({
    mutationKey: api.gallery.uploadImage.$get(),
    mutationFn: ({ file, path }: { file: File; path?: string }) =>
      api.$use.gallery.uploadImage(file, path),
    meta: {
      errorMessage: "Failed to upload image.",
      successMessage: "Image uploaded successfully.",
    },
  });
}

/**
 * Executive Hooks
 */

export function useFetchExecutives(filters?: {
  tier?: "presidential" | "council" | "directorate";
  tenureYear?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: api.executive.fetchAll.$use(filters),
    queryFn: () => api.$use.executive.fetchAll(filters),
  });
}

export function useFetchCurrentExecutives() {
  return useQuery({
    queryKey: api.executive.fetchCurrent.$use(),
    queryFn: () => api.$use.executive.fetchCurrent(),
  });
}

export function useFetchExecutive(executiveId: string) {
  return useQuery({
    queryKey: api.executive.fetchById.$use(executiveId),
    queryFn: () => api.$use.executive.fetchById(executiveId),
    enabled: !!executiveId,
  });
}

export function useFetchTenureYears() {
  return useQuery({
    queryKey: api.executive.fetchTenureYears.$use(),
    queryFn: () => api.$use.executive.fetchTenureYears(),
  });
}

export function useCreateExecutive() {
  return useMutation({
    mutationKey: api.executive.create.$get(),
    mutationFn: api.$use.executive.create,
    meta: {
      errorMessage: "Failed to create executive.",
      successMessage: "Executive created successfully.",
    },
  });
}

/**
 * Chapter Hooks
 */

export function useFetchChapters(filters?: {
  region?:
    | "North Central"
    | "North East"
    | "North West"
    | "South East"
    | "South South"
    | "South West";
  state?: string;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: api.chapter.fetchAll.$use(filters),
    queryFn: () => api.$use.chapter.fetchAll(filters),
  });
}

export function useFetchChapter(chapterId: string) {
  return useQuery({
    queryKey: api.chapter.fetchById.$use(chapterId),
    queryFn: () => api.$use.chapter.fetchById(chapterId),
    enabled: !!chapterId,
  });
}

export function useFetchChapterByState(state: string) {
  return useQuery({
    queryKey: api.chapter.fetchByState.$use(state),
    queryFn: () => api.$use.chapter.fetchByState(state),
    enabled: !!state,
  });
}

export function useCreateChapter() {
  return useMutation({
    mutationKey: api.chapter.create.$get(),
    mutationFn: api.$use.chapter.create,
    meta: {
      errorMessage: "Failed to create chapter.",
      successMessage: "Chapter created successfully.",
    },
  });
}

/**
 * Gallery Hooks
 */

export function useUpdateGallery() {
  return useMutation({
    mutationKey: api.gallery.updateCollection.$get(),
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.$use.gallery.updateCollection(id, data),
    meta: {
      errorMessage: "Failed to update gallery.",
      successMessage: "Gallery updated successfully.",
    },
  });
}

export function useDeleteGallery() {
  return useMutation({
    mutationKey: api.gallery.deleteCollection.$get(),
    mutationFn: (id: string) => api.$use.gallery.deleteCollection(id),
    meta: {
      errorMessage: "Failed to delete gallery.",
      successMessage: "Gallery deleted successfully.",
    },
  });
}
