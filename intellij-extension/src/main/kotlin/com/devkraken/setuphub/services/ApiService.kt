package com.devkraken.setuphub.services

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.diagnostic.Logger
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Service for API communication with the SetupHub backend.
 * Handles all HTTP requests for syncing setups, authentication, and user data.
 */
@Service
class ApiService {
    private val client: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(REQUEST_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .readTimeout(REQUEST_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .writeTimeout(REQUEST_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .build()
    
    private val gson = Gson()
    private val mediaType = "application/json; charset=utf-8".toMediaType()

    companion object {
        private val LOG = Logger.getInstance(ApiService::class.java)
        
        // TODO: Make configurable via plugin settings for production
        private const val BASE_URL = "https://setuphub.dev/api"
        private const val WEB_URL = "https://setuphub.dev"
        private const val REQUEST_TIMEOUT_SECONDS = 30L

        fun getInstance(): ApiService = ApplicationManager.getApplication().getService(ApiService::class.java)
    }

    /**
     * Sync user setup to the backend.
     * 
     * @param setup The user setup data to sync
     * @param token Authentication token
     * @return SyncResponse containing the share URL
     * @throws IOException if the request fails
     */
    @Throws(IOException::class)
    fun syncSetup(setup: UserSetup, token: String): SyncResponse {
        require(token.isNotBlank()) { "Token cannot be blank" }
        
        val json = gson.toJson(setup)
        val body = json.toRequestBody(mediaType)
        
        LOG.info("Syncing setup: ${setup.name} for ${setup.editorName}")
        
        val request = Request.Builder()
            .url("$BASE_URL/setups")
            .post(body)
            .addHeader("Authorization", "Bearer $token")
            .addHeader("Content-Type", "application/json")
            .build()
            
        client.newCall(request).execute().use { response ->
            val responseBody = response.body?.string()
            
            if (!response.isSuccessful) {
                LOG.warn("Sync failed with code ${response.code}")
                throw IOException("Sync failed (${response.code}): ${parseErrorMessage(responseBody)}")
            }
            
            if (responseBody.isNullOrBlank()) {
                throw IOException("Empty response from server")
            }
            
            return try {
                gson.fromJson(responseBody, SyncResponse::class.java)
            } catch (e: JsonSyntaxException) {
                LOG.error("Failed to parse sync response", e)
                throw IOException("Invalid response format from server")
            }
        }
    }

    /**
     * Get existing setup for current IDE.
     * 
     * @param token Authentication token
     * @param editorName Name of the editor (e.g., "intellij-idea")
     * @return ExistingSetup if found, null otherwise
     * @throws IOException if the request fails (except 404)
     */
    @Throws(IOException::class)
    fun getExistingSetup(token: String, editorName: String): ExistingSetup? {
        require(token.isNotBlank()) { "Token cannot be blank" }
        require(editorName.isNotBlank()) { "Editor name cannot be blank" }
        
        val request = Request.Builder()
            .url("$BASE_URL/setups/$editorName")
            .get()
            .addHeader("Authorization", "Bearer $token")
            .build()
            
        client.newCall(request).execute().use { response ->
            // 404 means no existing setup - this is expected for new users
            if (response.code == 404) {
                LOG.info("No existing setup found for $editorName")
                return null
            }
            
            val responseBody = response.body?.string()
            
            if (!response.isSuccessful) {
                LOG.warn("Failed to get setup with code ${response.code}")
                throw IOException("Failed to get setup (${response.code}): ${parseErrorMessage(responseBody)}")
            }
            
            if (responseBody.isNullOrBlank()) {
                return null
            }
            
            return try {
                gson.fromJson(responseBody, ExistingSetup::class.java)
            } catch (e: JsonSyntaxException) {
                LOG.warn("Failed to parse existing setup response", e)
                null
            }
        }
    }

    /**
     * Verify token and get user profile.
     * 
     * @param token Authentication token to verify
     * @return UserProfile if token is valid
     * @throws IOException if verification fails
     */
    @Throws(IOException::class)
    fun verifyToken(token: String): UserProfile {
        require(token.isNotBlank()) { "Token cannot be blank" }
        
        val request = Request.Builder()
            .url("$BASE_URL/user/me")
            .get()
            .addHeader("Authorization", "Bearer $token")
            .build()
            
        client.newCall(request).execute().use { response ->
            val responseBody = response.body?.string()
            
            if (response.code == 401) {
                throw IOException("Invalid or expired token. Please generate a new token from the dashboard.")
            }
            
            if (!response.isSuccessful) {
                LOG.warn("Token verification failed with code ${response.code}")
                throw IOException("Token verification failed (${response.code}): ${parseErrorMessage(responseBody)}")
            }
            
            if (responseBody.isNullOrBlank()) {
                throw IOException("Empty response from server")
            }
            
            val verifyResponse = try {
                gson.fromJson(responseBody, VerifyResponse::class.java)
            } catch (e: JsonSyntaxException) {
                LOG.error("Failed to parse verify response", e)
                throw IOException("Invalid response format from server")
            }
            
            if (!verifyResponse.success || verifyResponse.user == null) {
                throw IOException("Invalid token response from server")
            }
            
            LOG.info("Token verified for user: ${verifyResponse.user.username}")
            return verifyResponse.user
        }
    }

    /**
     * Parse error message from JSON response body.
     */
    private fun parseErrorMessage(errorBody: String?): String {
        if (errorBody.isNullOrBlank()) return "Unknown error"
        return try {
            val errorResponse = gson.fromJson(errorBody, ErrorResponse::class.java)
            errorResponse.error ?: "Unknown error"
        } catch (e: Exception) {
            errorBody.take(200)
        }
    }

    // URL Helpers

    /** Get dashboard URL where users can sign in and get their token */
    fun getAuthUrl(): String = "$WEB_URL/dashboard"

    /** Get profile URL for a user */
    fun getProfileUrl(username: String): String {
        require(username.isNotBlank()) { "Username cannot be blank" }
        return "$WEB_URL/$username"
    }

    /** Get community setups browsing URL */
    fun getSetupsUrl(): String = "$WEB_URL/setups"
}

// Data Classes

/**
 * Response from GET /user/me endpoint
 */
data class VerifyResponse(
    val success: Boolean,
    val user: UserProfile?
)

/**
 * User profile information
 */
data class UserProfile(
    val id: String,
    val username: String,
    val name: String?,
    val email: String?,
    val avatarUrl: String? = null
)

/**
 * Complete user setup configuration to sync
 */
data class UserSetup(
    val name: String,
    val description: String?,
    val editorName: String,
    val theme: String,
    val fontFamily: String,
    val fontSize: Int,
    val extensions: List<ExtensionInfo>,
    val settings: Map<String, Any>,
    val isPublic: Boolean
)

/**
 * Extension/plugin information
 */
data class ExtensionInfo(
    val name: String,
    val id: String,
    val version: String,
    val publisher: String? = null,
    val description: String? = null
)

/**
 * Response from POST /setups endpoint
 */
data class SyncResponse(
    val success: Boolean = true,
    val setupId: String? = null,
    val shareUrl: String,
    val message: String? = null
)

/**
 * Existing setup data from GET /setups/{editorName}
 */
data class ExistingSetup(
    val name: String,
    val description: String?
)

/**
 * Generic API error response
 */
data class ErrorResponse(
    val error: String?,
    val details: List<Any>? = null
)
