import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  queryOptions,
} from "@tanstack/react-query";
import { api } from "@/api";

import type { UserData } from "@/api/user";
import type { TransactionData } from "@/api/mandate";
import type { ArticleData } from "@/api/article";
import type { GalleryData } from "@/api/gallery";
import type { ExecutiveData } from "@/api/executive";
import type { EventData } from "@/api/event";
import type { IssueData } from "@/api/newsletter";
import type { Variables } from "@/client/core-query";
import type { Options } from "@/client/options";

/**
 * User Management Hooks
 */

export function useFetchUsers(
  variables?: Variables<UserData>,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: api.user.fetchAll.$use(variables),
    queryFn: () => api.$use.user.fetchAll(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useUpdateUser() {
  return useMutation({
    mutationKey: api.user.update.$get(),
    mutationFn: api.$use.user.update,
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

export function useLoginWithProvider() {
  return useMutation({
    mutationKey: api.user.loginWithProvider.$get(),
    mutationFn: api.$use.user.loginWithProvider,
    meta: {
      errorMessage: "Social login failed. Please try again.",
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
  return useQuery<TransactionData[]>({
    queryKey: api.mandate.fetchTransactions.$use(mandateId),
    queryFn: () => api.$use.mandate.fetchTransactions(mandateId),
    enabled: !!mandateId,
  });
}

export function useFetchUserTransactions(userId: string) {
  return useQuery<TransactionData[]>({
    queryKey: api.mandate.fetchUserTransactions.$use(userId),
    queryFn: () => api.$use.mandate.fetchUserTransactions(userId),
    enabled: !!userId,
  });
}

export function useMandateCertificate(userId: string) {
  return useQuery({
    queryKey: api.mandate.fetchCertificate.$use(userId),
    queryFn: () => api.$use.mandate.fetchCertificate(userId),
    enabled: !!userId,
  });
}

export function useMandateCertificateSettings() {
  return useQuery({
    queryKey: api.mandate.fetchCertificateSettings.$use(),
    queryFn: () => api.$use.mandate.fetchCertificateSettings(),
  });
}

export function useUpdateMandateCertificateSettings() {
  return useMutation({
    mutationKey: api.mandate.updateCertificateSettings.$get(),
    mutationFn: api.$use.mandate.updateCertificateSettings,
    meta: {
      errorMessage: "Failed to update certificate settings.",
      successMessage: "Certificate settings updated.",
    },
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

export function useUpdatePaymentPartner() {
  return useMutation({
    mutationKey: api.paymentPartner.update.$get(),
    mutationFn: api.$use.paymentPartner.update,
    meta: {
      errorMessage: "Failed to update payment partner.",
      successMessage: "Payment partner updated successfully.",
    },
  });
}

export function useFetchPaymentPartners() {
  return useQuery({
    queryKey: api.paymentPartner.fetchAll.$use(),
    queryFn: () => api.$use.paymentPartner.fetchAll(),
  });
}

export function useFetchPaymentPartner(partnerId?: string) {
  return useQuery({
    queryKey: api.paymentPartner.fetch.$get(partnerId),
    queryFn: () => api.$use.paymentPartner.fetch(partnerId!),
    enabled: !!partnerId,
  });
}

export function useFetchActivePaymentPartner() {
  return useQuery({
    queryKey: api.paymentPartner.getActive.$use(),
    queryFn: () => api.$use.paymentPartner.getActive(),
  });
}

/**
 * Mono Hooks
 */

export function useFetchMonoBanks() {
  return useQuery({
    queryKey: api.mono.bank.fetchAll.$use(),
    queryFn: () => api.$use.mono.bank.fetchAll(),
  });
}

/**
 * Chapter Hooks
 */

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

export function useUpdateChapter() {
  return useMutation({
    mutationKey: api.chapter.update.$get(),
    mutationFn: api.$use.chapter.update,
    meta: {
      errorMessage: "Failed to update chapter.",
      successMessage: "Chapter updated successfully.",
    },
  });
}

export function useFetchChapters(filters?: { isActive?: boolean }) {
  return useQuery({
    queryKey: api.chapter.fetchAll.$use(filters),
    queryFn: () => api.$use.chapter.fetchAll(filters),
  });
}

export function useFetchChapter(chapterId?: string) {
  return useQuery({
    queryKey: api.chapter.fetchById.$get(chapterId),
    queryFn: () => api.$use.chapter.fetchById(chapterId!),
    enabled: !!chapterId,
  });
}

export function useFetchChapterByState(state?: string) {
  return useQuery({
    queryKey: api.chapter.fetchByState.$get(state),
    queryFn: () => api.$use.chapter.fetchByState(state!),
    enabled: !!state,
  });
}

/**
 * Event Management Hooks
 */

export function useFetchEvents(
  variables?: Variables<EventData>,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: api.event.fetchAll.$use(variables),
    queryFn: () => api.$use.event.fetchAll(variables),
  })
) {
  return useQuery({ ...query, ...options });
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

export function useFetchNewsletterIssues(
  variables?: Variables<IssueData>,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: api.newsletter.fetchIssues.$use(variables),
    queryFn: () => api.$use.newsletter.fetchIssues(variables),
  })
) {
  return useQuery({ ...query, ...options });
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

export function useFetchArticles(
  variables?: Variables<ArticleData>,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: api.article.fetchAll.$use(variables),
    queryFn: () => api.$use.article.fetchAll(variables),
  })
) {
  return useQuery({ ...query, ...options });
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

export function useIncrementViewCount() {
  return useMutation({
    mutationKey: api.article.incrementViewCount.$get(),
    mutationFn: (id: string) => api.$use.article.incrementViewCount(id),
  });
}

/**
 * Gallery Hooks
 */

export function useFetchGalleryCollections(
  variables?: Variables<GalleryData>,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: api.gallery.fetchCollections.$use(variables),
    queryFn: () => api.$use.gallery.fetchCollections(variables),
  })
) {
  return useQuery({ ...query, ...options });
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
    mutationFn: api.$use.gallery.uploadImage,
    meta: {
      errorMessage: "Failed to upload image.",
      successMessage: "Image uploaded successfully.",
    },
  });
}

/**
 * Executive Hooks
 */

export function useFetchExecutives(
  variables?: Variables<ExecutiveData>,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: api.executive.fetchAll.$use(variables),
    queryFn: () => api.$use.executive.fetchAll(variables),
  })
) {
  return useQuery({ ...query, ...options });
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

/**
 * Feed Hooks
 */

export function useUserFeed(userId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ["feed", "user", userId] as const,
    queryFn: ({ pageParam }) =>
      api.$use.feed.fetchUserFeed({ userId, limit, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: !!userId,
  });
}

export function useMandateFeed(mandateId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ["feed", "mandate", mandateId] as const,
    queryFn: ({ pageParam }) =>
      api.$use.feed.fetchMandateFeed({ mandateId, limit, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: !!mandateId,
  });
}

export function useGlobalFeed(limit = 20) {
  return useInfiniteQuery({
    queryKey: ["feed", "global"] as const,
    queryFn: ({ pageParam }) =>
      api.$use.feed.fetchGlobalFeed({ limit, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
}
