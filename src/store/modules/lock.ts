import { defineStore } from 'pinia'
import { store } from '../index'

/**
 * Lock information interface defining the structure of screen lock data
 * @interface lockInfo
 * @property {boolean} isLock - Whether the screen is currently locked
 * @property {string} password - Password hash or encrypted password for unlocking
 */
interface lockInfo {
  isLock?: boolean
  password?: string
}

/**
 * Lock state interface defining the structure of lock-related state
 * @interface LockState
 * @property {lockInfo} lockInfo - Current lock information and settings
 */
interface LockState {
  lockInfo: lockInfo
}

/**
 * Lock Store - Manages screen lock functionality and security
 *
 * This store handles:
 * - Screen lock state management
 * - Password verification for unlocking
 * - Lock information persistence
 * - Security-related state
 *
 * @example
 * ```typescript
 * // Basic usage
 * const lockStore = useLockStore()
 *
 * // Set lock password
 * lockStore.setLockInfo({ isLock: true, password: 'hashedPassword' })
 *
 * // Attempt to unlock
 * const success = lockStore.unLock('userPassword')
 * ```
 */
export const useLockStore = defineStore('lock', {
  /**
   * Initial state configuration for the lock store
   * @returns {LockState} Initial lock state with empty lock info
   */
  state: (): LockState => {
    return {
      lockInfo: {
        // isLock: false, // Whether screen is locked
        // password: '' // Lock screen password
      }
    }
  },

  /**
   * Computed properties (getters) for accessing lock state
   */
  getters: {
    /**
     * Get current lock information
     * @returns {lockInfo} Current lock state and password
     */
    getLockInfo(): lockInfo {
      return this.lockInfo
    }
  },

  /**
   * Actions for modifying lock state and performing lock operations
   */
  actions: {
    /**
     * Set lock information including lock state and password
     * @param {lockInfo} lockInfo - Lock configuration to apply
     */
    setLockInfo(lockInfo: lockInfo) {
      this.lockInfo = lockInfo
    },

    /**
     * Reset lock information to empty state
     * Clears both lock state and password
     */
    resetLockInfo() {
      this.lockInfo = {}
    },

    /**
     * Attempt to unlock the screen with provided password
     * @param {string} password - Password to verify for unlocking
     * @returns {boolean} True if password matches and unlock successful, false otherwise
     *
     * This action:
     * 1. Compares provided password with stored password
     * 2. Resets lock info if password matches
     * 3. Returns success/failure status
     */
    unLock(password: string) {
      if (this.lockInfo?.password === password) {
        this.resetLockInfo()
        return true
      } else {
        return false
      }
    }
  },

  /**
   * Enable persistence for this store
   * Lock information will be automatically saved to localStorage and restored on page reload
   */
  persist: true
})

export const useLockStoreWithOut = () => {
  return useLockStore(store)
}
