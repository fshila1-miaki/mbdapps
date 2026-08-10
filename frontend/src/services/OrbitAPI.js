// Orbit API Simulation Layer
// Mirrors real API from swagger documentation
// All endpoints return structured responses matching the real API schema

const MOCK_APP_ID = "APP_000375";
const MOCK_PASSWORD = "a07118cda5215fc6d01db5b2ab848edd";
const BASE_URL = "https://developer.orbit.app";

// Simulated delay to feel realistic (800ms - 1500ms)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// In-memory state for simulation
const state = {
  subscribers: {}, // msisdn → { status, subscriptionDate, balance }
  otpStore: {}, // referenceNo → { otp, msisdn, expiresAt }
  smsLogs: [],
  transactions: [],
};

// ─── API MONITOR PUB/SUB ───
const listeners = new Set();
const monitorLogs = [];
const notify = (entry) => {
  const log = {
    id: `LOG_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  monitorLogs.unshift(log);
  if (monitorLogs.length > 80) monitorLogs.pop();
  listeners.forEach((l) => l(log));
  return log;
};

export const subscribeMonitor = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getMonitorLogs = () => [...monitorLogs];
export const clearMonitorLogs = () => {
  monitorLogs.length = 0;
  listeners.forEach((l) => l(null));
};

// ─── OTP API ───
export const requestOTP = async (subscriberMSISDN) => {
  const start = Date.now();
  await delay(900 + Math.random() * 400);
  const referenceNo = Math.random().toString(36).slice(2, 17).toUpperCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const msisdn = `tel:88${String(subscriberMSISDN).replace(/^0/, "")}`;
  state.otpStore[referenceNo] = { otp, msisdn, expiresAt: Date.now() + 300000 };

  state.smsLogs.push({
    type: "OTP",
    to: msisdn,
    message: `Your Orbit OTP is: ${otp}. Valid for 5 minutes.`,
    timestamp: new Date().toISOString(),
    status: "DELIVERED",
  });

  const response = {
    version: "1.0",
    statusCode: "S1000",
    referenceNo,
    statusDetail: `Successfully send OTP challenge to ${msisdn}`,
    _demo_otp: otp,
  };
  notify({
    method: "POST",
    endpoint: "/otp/request",
    category: "OTP",
    request: { applicationId: MOCK_APP_ID, password: "***", subscriberMSISDN, applicationHash: "f56a1c...", applicationMetaData: { client: "WEB", device: "Browser", os: "Android", appName: "Orbit Demo" } },
    response,
    statusCode: "S1000",
    elapsedMs: Date.now() - start,
  });
  return response;
};

export const verifyOTP = async (referenceNo, enteredOtp) => {
  const start = Date.now();
  await delay(700 + Math.random() * 300);
  const record = state.otpStore[referenceNo];
  let response;
  if (!record) {
    response = { version: "1.0", statusCode: "E1854", statusDetail: "Could not find OTP", subscriptionStatus: "UNREGISTERED" };
  } else if (Date.now() > record.expiresAt) {
    response = { version: "1.0", statusCode: "E1851", statusDetail: "OTP request has been expired", subscriptionStatus: "UNREGISTERED" };
  } else if (record.otp !== enteredOtp && enteredOtp !== "123456") {
    response = { version: "1.0", statusCode: "E1850", statusDetail: "Invalid OTP", subscriptionStatus: "UNREGISTERED" };
  } else {
    const subscriberId = `tel:masked_${record.msisdn.slice(-6)}`;
    delete state.otpStore[referenceNo];
    response = {
      version: "1.0",
      statusCode: "S1000",
      subscriptionStatus: "REGISTERED",
      statusDetail: `Successfully validated OTP for ${record.msisdn}`,
      subscriberId,
    };
  }
  notify({
    method: "POST",
    endpoint: "/otp/verify",
    category: "OTP",
    request: { applicationId: MOCK_APP_ID, password: "***", referenceNo, otp: enteredOtp },
    response,
    statusCode: response.statusCode,
    elapsedMs: Date.now() - start,
  });
  return response;
};

// ─── Subscription API ───
export const userSubscription = async (subscriberId, action) => {
  const start = Date.now();
  await delay(800 + Math.random() * 300);
  const msisdn = subscriberId.replace("tel:", "");
  if (action === "SUB") {
    state.subscribers[msisdn] = { status: "REGISTERED", subscriptionDate: new Date().toISOString(), balance: 200 };
    state.smsLogs.push({ type: "SUBSCRIPTION", to: subscriberId, message: "You have successfully subscribed. Reply STOP to unsubscribe.", timestamp: new Date().toISOString(), status: "DELIVERED" });
  } else if (state.subscribers[msisdn]) {
    state.subscribers[msisdn].status = "UNREGISTERED";
    state.smsLogs.push({ type: "UNSUBSCRIPTION", to: subscriberId, message: "You have been unsubscribed from the service.", timestamp: new Date().toISOString(), status: "DELIVERED" });
  }
  const response = { version: "1.0", statusCode: "S1000", statusDetail: action === "SUB" ? "Subscribed successfully" : "Unsubscribed successfully" };
  notify({ method: "POST", endpoint: "/subscription/userSubscription", category: "Subscription", request: { applicationId: MOCK_APP_ID, password: "***", subscriberId, action }, response, statusCode: "S1000", elapsedMs: Date.now() - start });
  return response;
};

export const getSubscriberStatus = async (subscriberId) => {
  const start = Date.now();
  await delay(500 + Math.random() * 200);
  const msisdn = subscriberId.replace("tel:", "");
  const sub = state.subscribers[msisdn];
  const response = { version: "1.0", statusCode: "S1000", statusDetail: "Request was successfully processed", subscriptionStatus: sub?.status || "UNREGISTERED" };
  notify({ method: "POST", endpoint: "/subscription/getSubscriberStatus", category: "Subscription", request: { applicationId: MOCK_APP_ID, password: "***", subscriberId }, response, statusCode: "S1000", elapsedMs: Date.now() - start });
  return response;
};

export const getBaseSize = async () => {
  const start = Date.now();
  await delay(450 + Math.random() * 200);
  const count = Object.keys(state.subscribers).length + 184234;
  const response = { version: "1.0", statusCode: "S1000", statusDetail: "Request was successfully processed", count };
  notify({ method: "POST", endpoint: "/subscription/baseSize", category: "Subscription", request: { applicationId: MOCK_APP_ID, password: "***" }, response, statusCode: "S1000", elapsedMs: Date.now() - start });
  return response;
};

export const notifySubscribers = async (message, appId) => {
  const start = Date.now();
  await delay(1100 + Math.random() * 400);
  const count = Object.keys(state.subscribers).length + 184234;
  state.smsLogs.push({ type: "NOTIFY", to: "ALL_SUBSCRIBERS", message, timestamp: new Date().toISOString(), status: "SENT", count });
  const response = { version: "1.0", statusCode: "S1000", statusDetail: "Request was successfully processed", sentCount: count };
  notify({ method: "POST", endpoint: "/subscription/notify", category: "Subscription", request: { applicationId: appId || MOCK_APP_ID, password: "***", message, broadcast: true }, response, statusCode: "S1000", elapsedMs: Date.now() - start });
  return response;
};

// ─── SMS API ───
export const sendSMS = async (destinationAddresses, message, sourceAddress) => {
  const start = Date.now();
  await delay(600 + Math.random() * 300);
  const messageId = "MID_" + Math.random().toString(36).slice(2, 12).toUpperCase();
  destinationAddresses.forEach((addr) => {
    state.smsLogs.push({ type: "MT_SMS", to: addr, from: sourceAddress, message, messageId, timestamp: new Date().toISOString(), status: "DELIVERED" });
  });
  const response = { version: "1.0", statusCode: "S1000", statusDetail: "Request was successfully processed", messageId };
  notify({
    method: "POST",
    endpoint: "/sms/send",
    category: "SMS",
    request: { applicationId: MOCK_APP_ID, password: "***", message, destinationAddresses, sourceAddress, deliveryStatusRequest: 1, encoding: 0 },
    response,
    statusCode: "S1000",
    elapsedMs: Date.now() - start,
  });
  return response;
};

export const getSMSLogs = () => [...state.smsLogs].reverse();

// ─── CaaS API ───
export const queryBalance = async (subscriberId) => {
  const start = Date.now();
  await delay(700 + Math.random() * 250);
  const msisdn = subscriberId.replace("tel:", "");
  const sub = state.subscribers[msisdn] || { balance: 150, status: "ACTIVE" };
  const response = {
    version: "1.0",
    statusCode: "S1000",
    statusDetail: "Request was successfully processed",
    accountInfo: { accountType: "Prepaid", accountStatus: "Active", availableBalance: sub.balance, currency: "BDT" },
  };
  notify({ method: "POST", endpoint: "/caas/queryBalance", category: "CaaS", request: { applicationId: MOCK_APP_ID, password: "***", subscriberId }, response, statusCode: "S1000", elapsedMs: Date.now() - start });
  return response;
};

export const directDebit = async (subscriberId, amount, description) => {
  const start = Date.now();
  await delay(950 + Math.random() * 350);
  const msisdn = subscriberId.replace("tel:", "");
  if (!state.subscribers[msisdn]) state.subscribers[msisdn] = { status: "REGISTERED", balance: 150 };
  const sub = state.subscribers[msisdn];
  let response;
  if (sub.balance < amount) {
    response = { version: "1.0", statusCode: "E4012", statusDetail: "Insufficient Balance", errorDescription: "User does not have enough balance to be charged" };
  } else {
    sub.balance -= amount;
    const transactionId = "TXN_" + Math.random().toString(36).slice(2, 14).toUpperCase();
    state.transactions.push({ transactionId, subscriberId, amount, currency: "BDT", description, timestamp: new Date().toISOString(), status: "SUCCESS" });
    response = { version: "1.0", statusCode: "S1000", statusDetail: "Request was successfully processed", transactionId, amount, currency: "BDT" };
  }
  notify({
    method: "POST",
    endpoint: "/caas/directDebit",
    category: "CaaS",
    request: { applicationId: MOCK_APP_ID, password: "***", externalTrxId: "ETX_" + Date.now(), paymentInstrumentName: "Mobile Account", subscriberId, amount, currency: "BDT", description },
    response,
    statusCode: response.statusCode,
    elapsedMs: Date.now() - start,
  });
  return response;
};

export const getTransactionLogs = () => [...state.transactions].reverse();
