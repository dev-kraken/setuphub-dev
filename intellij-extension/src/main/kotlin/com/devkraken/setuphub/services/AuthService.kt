package com.devkraken.setuphub.services

import com.intellij.credentialStore.CredentialAttributes
import com.intellij.credentialStore.Credentials
import com.intellij.credentialStore.generateServiceName
import com.intellij.ide.passwordSafe.PasswordSafe
import com.intellij.ide.util.PropertiesComponent
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.Service
import com.intellij.openapi.diagnostic.Logger

/**
 * Service for managing authentication state.
 * Uses PasswordSafe for secure token storage with fallback to PropertiesComponent.
 */
@Service
class AuthService {

    companion object {
        private val LOG = Logger.getInstance(AuthService::class.java)
        
        private const val SERVICE_NAME = "SetupHub"
        private const val TOKEN_KEY = "setuphub_token"
        private const val USERNAME_KEY = "com.devkraken.setuphub.username"
        private const val DISPLAY_NAME_KEY = "com.devkraken.setuphub.display_name"
        private const val FALLBACK_TOKEN_KEY = "$USERNAME_KEY.token"

        fun getInstance(): AuthService = ApplicationManager.getApplication().getService(AuthService::class.java)
    }

    private val properties: PropertiesComponent
        get() = PropertiesComponent.getInstance()

    private val credentialAttributes: CredentialAttributes
        get() = CredentialAttributes(generateServiceName(SERVICE_NAME, TOKEN_KEY))

    /** Check if user is authenticated */
    fun isAuthenticated(): Boolean = !getToken().isNullOrBlank()

    /** Get stored authentication token (uses PasswordSafe with fallback) */
    fun getToken(): String? = try {
        PasswordSafe.instance.getPassword(credentialAttributes)
    } catch (e: Exception) {
        LOG.debug("PasswordSafe unavailable, using fallback: ${e.message}")
        properties.getValue(FALLBACK_TOKEN_KEY)
    }

    /** Store authentication token securely */
    fun setToken(token: String?) {
        try {
            token?.let {
                PasswordSafe.instance.set(credentialAttributes, Credentials(TOKEN_KEY, it))
            } ?: PasswordSafe.instance.set(credentialAttributes, null)
        } catch (e: Exception) {
            LOG.debug("PasswordSafe unavailable, using fallback: ${e.message}")
            token?.let { properties.setValue(FALLBACK_TOKEN_KEY, it) }
                ?: properties.unsetValue(FALLBACK_TOKEN_KEY)
        }
    }

    /** Get stored username */
    fun getUsername(): String? = properties.getValue(USERNAME_KEY)

    /** Store username */
    fun setUsername(username: String?) {
        username?.let { properties.setValue(USERNAME_KEY, it) }
            ?: properties.unsetValue(USERNAME_KEY)
    }

    /** Get stored display name */
    fun getDisplayName(): String? = properties.getValue(DISPLAY_NAME_KEY)

    /** Store display name */
    fun setDisplayName(displayName: String?) {
        displayName?.let { properties.setValue(DISPLAY_NAME_KEY, it) }
            ?: properties.unsetValue(DISPLAY_NAME_KEY)
    }

    /** Get display name or username as fallback */
    fun getDisplayNameOrUsername(): String? = getDisplayName() ?: getUsername()

    /** Clear all authentication data */
    fun logout() {
        LOG.info("Clearing authentication data")
        setToken(null)
        setUsername(null)
        setDisplayName(null)
    }
}
