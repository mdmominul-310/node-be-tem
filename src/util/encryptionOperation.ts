
class EncryptionOperation {
    salt: string;
    constructor(saltRounds: string) {
        this.salt = saltRounds;
    }

    async hashPassword(password: string): Promise<string> {
        try {
            if (!password) {
                throw new Error("Password is required");
            }
            const bcrypt = require('bcrypt');
            const hash = await bcrypt.hash(password, parseInt(this.salt));
            return hash as string;
        } catch (err) {

            return err as string;
        }

    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        const bcrypt = require('bcrypt');
        const result = await bcrypt.compare(password, hash);
        return result;
    }
}

const encryptionOperation = new EncryptionOperation("10");
export default encryptionOperation;