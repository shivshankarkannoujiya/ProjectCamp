import crypto from "crypto";

const hashIncommingUnHashedToken = (unHashedToken) => {
    const hashedIncommingToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    return { hashedIncommingToken };
};

export { hashIncommingUnHashedToken };
