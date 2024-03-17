export interface FormRequest {
    token: string
    submissionObject: SubmissionObject
}

export interface SubmissionObject {
    fullName: string
    email: string
    message: string
}