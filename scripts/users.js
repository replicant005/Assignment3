/**
 * author - mehak kapur
 * date - 22nd feb , 2025
  */

(function() {
    /**
     * User class represents a user with basic properties like display name, email, username, and password.
     **/
    class User {
        constructor(displayName = "", emailAddress = "", userName = "", password = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._userName = userName;
            this._password = password;
        }

        get displayName() {
            return this._displayName;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        get userName() {
            return this._userName;
        }

        set displayName(displayName) {
            this._displayName = displayName;
        }

        setEmailAddress(emailAddress) {
            this._emailAddress = emailAddress;
        }

        setUserName(userName) {
            this._userName = userName; // Fix: Changed _username to _userName
        }

        /**
         * Converts the user object to a string representation.
         * @returns {string} A string describing the user with display name, email address, and username.
         */
        toString() {
            return `Display Name: ${this.displayName}\nEmail Address: ${this.emailAddress}\nUser Name: ${this.userName}`;
        }

        /**
         * Serializes the user object to a string.
         * @returns {string|null} A string with display name, username, and email address, or null if properties are missing.
         */

        serialize() {
            if (this._displayName !== "" && this.emailAddress !== "" && this._userName !== "") {
                return `${this.displayName}, ${this._userName}, ${this.emailAddress}`;
            }
            console.error("[ERROR]Serialization failed! One or more user properties are missing. ");
            return null;
        }

        /**
         * Deserializes a string into a user object.
         * @param {string} data - A serialized string containing display name, username, and email address.
         */

        deserialize(data) {
            let propertyArray = data.split(",");
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._userName = propertyArray[2]; // Fix: Changed _username to _userName
        }

        /**
         * Converts the user object to a JSON object.
         * @returns {Object} A JSON object representing the user with display name, email address, username, and password.
         */

        toJSON() {
            return {
                DisplayName: this._displayName,
                EmailAddress: this._emailAddress,
                UserName: this._userName,
                Password: this._password,
            };
        }

        /**
         * Populates the user object from a JSON object.
         * @param {Object} data - A JSON object with user properties: DisplayName, EmailAddress, UserName, Password.
         */

        fromJSON(data) {
            this._displayName = data.DisplayName;
            this._emailAddress = data.EmailAddress;
            this._userName = data.UserName;
            this._password = data.Password;
        }

    }

})

