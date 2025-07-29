import { EmailRetrieveResponse, ThreadRetrieveResponse } from '../resources';

export const threadToLLMString = (thread: ThreadRetrieveResponse) => {
  const interestingFieldsForLLM = getInterestingThreadFields(thread);

  return objectToLLMFriendlyText({
    object: interestingFieldsForLLM,
    wrapperTag: 'thread',
  });
};

export const emailToLLMString = (email: EmailRetrieveResponse) => {
  const interestingFieldsForLLM = getInterestingEmailFields(email);

  return objectToLLMFriendlyText({
    object: interestingFieldsForLLM,
    wrapperTag: 'email',
  });
};

const getInterestingThreadFields = (thread: ThreadRetrieveResponse) => {
  return {
    id: thread.id,
    subject: thread.subject,
    emails: thread.emails.map((email) => getInterestingEmailFields(email)),
  };
};

const getInterestingEmailFields = (email: EmailRetrieveResponse) => {
  return {
    id: email.id,
    attachments: email.attachments.map((attachment) => ({
      id: attachment.id,
      cid: attachment.cid,
      fileName: attachment.fileName,
    })),
    bccAddresses: email.bccAddresses,
    ccAddresses: email.ccAddresses,
    direction: email.direction,
    fromAddress: email.fromAddress,
    fromName: email.fromName,
    inReplyToId: email.inReplyToId,
    messageId: email.messageId,
    receivedAt: email.receivedAt,
    references: email.references,
    replyToAddresses: email.replyToAddresses,
    sentAt: email.sentAt,
    status: email.status,
    text: email.text,
    toAddresses: email.toAddresses,
  };
};

const objectToLLMFriendlyText = ({
  object,
  wrapperTag = 'object',
}: {
  object: Record<string, any>;
  wrapperTag?: string | null;
}) => {
  const convertValue = (value: any, parentKey?: string): string => {
    if (value === null || value === undefined) {
      return '';
    }

    if (Array.isArray(value)) {
      return value
        .map((item, index) => {
          const itemTag = parentKey ? `${parentKey}_${index}` : `item_${index}`;
          if (typeof item === 'object' && item !== null) {
            return `<${itemTag}>${convertValue(item)}</${itemTag}>`;
          }
          return `<${itemTag}>${item}</${itemTag}>`;
        })
        .join('');
    }

    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `<${k}>${convertValue(v, k)}</${k}>`)
        .join('');
    }

    return String(value);
  };

  const xmlString = Object.entries(object)
    .map(([key, value]) => `<${key}>${convertValue(value, key)}</${key}>`)
    .join('');

  return `<${wrapperTag}>${xmlString}</${wrapperTag}>`;
};
