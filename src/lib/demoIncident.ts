import type { IncidentRequest } from '@/types/incident';

export interface DemoTestCase {
  id: string;
  label: string;
  description: string;
  request: IncidentRequest;
}

export const demoTestCases: DemoTestCase[] = [
  {
    id: 'campaign-ch100-cms-proxy-500',
    label: 'campaign-ch-100 CMS proxy 500 (real dev incident)',
    description: 'AMS /api/v1/campaign-ch-100 fails because CMS /ch-100/get returned HTTP 500.',
    request: {
      service: 'ad-management-service',
      environment: 'dev',
      apiPath: '/api/v1/campaign-ch-100?offset=0&limit=10000',
      httpStatus: 500,
      errorMessage: 'BusinessValidationException',
      relatedServices: ['campaign-management-service'],
      stackTrace: `org.springframework.web.client.HttpServerErrorException$InternalServerError: 500 : "{"code":500,"path":"/campaign-management-service/api/v1/campaign-management/ch-100/get","timestamp":"1789453997041"}"
\tat org.springframework.web.client.HttpServerErrorException.create(HttpServerErrorException.java:102)
\tat org.springframework.web.client.DefaultResponseErrorHandler.handleError(DefaultResponseErrorHandler.java:186)
\tat org.springframework.web.client.RestTemplate.handleResponse(RestTemplate.java:915)`,
      recentLogs: `ERROR com.tataplay.admanagement.exception.ErrorHandler - 500 : "{"code":500,"path":"/campaign-management-service/api/v1/campaign-management/ch-100/get","timestamp":"1789453997041"}"`,
    },
  },
  {
    id: 'rest-template-npe',
    label: 'RestTemplateUtility NPE (golden)',
    description: 'CMS returns HTTP 400 without a message field → NPE in AMS error parsing.',
    request: {
      service: 'ad-management-service',
      environment: 'dev',
      apiPath: '/api/v1/campaign-ch-100/multi-channel/filler-slots',
      httpStatus: 500,
      errorMessage: 'NullPointerException',
      relatedServices: ['campaign-management-service'],
      stackTrace: `java.lang.NullPointerException: Cannot invoke "com.fasterxml.jackson.databind.JsonNode.asText()" because the return value is null
\tat com.tataplay.admanagement.utility.RestTemplateUtility.extractErrorMessage(RestTemplateUtility.java:48)
\tat com.tataplay.admanagement.utility.RestTemplateUtility.handleError(RestTemplateUtility.java:32)`,
      recentLogs: 'CMS returned HTTP 400 with body {"code":"VALIDATION_ERROR"}',
    },
  },
  {
    id: 'business-validation',
    label: 'BusinessValidationException',
    description: 'CMS returns HTTP 500 via AMS proxy; include BusinessValidationException in the stack trace text.',
    request: {
      service: 'ad-management-service',
      environment: 'dev',
      apiPath: '/api/v1/campaign-ch-100',
      httpStatus: 500,
      errorMessage: 'BusinessValidationException',
      relatedServices: ['campaign-management-service'],
      stackTrace: `com.tataplay.campaignmanagement.exception.BusinessValidationException: CMS rejected request
\tat com.tataplay.campaignmanagement.module.ch100.service.impl.ChHundredCampaignServiceImpl.validateSlots(ChHundredCampaignServiceImpl.java:112)
\tat com.tataplay.admanagement.module.ch100.campaign.service.impl.CampaignChHundredServiceImpl.getFillerSlots(CampaignChHundredServiceImpl.java:87)
Caused by: org.springframework.web.client.HttpServerErrorException$InternalServerError: 500 : "{"code":500,"path":"/campaign-management-service/api/v1/campaign-management/ch-100/get"}"`,
      recentLogs: 'CMS responded with HTTP 400 and body {"code":"VALIDATION_ERROR","field":"slotDuration"}',
    },
  },
  {
    id: 'scte-timing',
    label: 'SCTE slot timing mismatch',
    description: 'SCTE marker attaches to multiple assets due to imprecise time parsing.',
    request: {
      service: 'campaign-management-service',
      environment: 'prod',
      apiPath: '/api/v1/ch-100/multi-channel/filler-slots',
      httpStatus: 500,
      errorMessage: 'IllegalStateException',
      relatedServices: [],
      stackTrace: `java.lang.IllegalStateException: SCTE marker matched multiple assets for the same time window
\tat com.tataplay.campaignmanagement.module.ch100.service.impl.Ch100ScteSlotServiceImpl.attachScteToAsset(Ch100ScteSlotServiceImpl.java:156)
\tat com.tataplay.campaignmanagement.module.ch100.service.impl.Ch100ScteSlotServiceImpl.parseTimeToMillis(Ch100ScteSlotServiceImpl.java:89)`,
      recentLogs: 'Asset startTime=10:30:45 but SCTE parsed as 10:30:00 — seconds ignored in parseTimeToMillis',
    },
  },
  {
    id: 'unknown-error',
    label: 'Unknown error (low confidence)',
    description: 'Generic stack trace with no known rule-based pattern — expects LOW confidence fallback.',
    request: {
      service: 'ad-management-service',
      environment: 'dev',
      apiPath: '/api/v1/playlist/asset/view',
      httpStatus: 503,
      errorMessage: 'ServiceUnavailableException',
      relatedServices: ['campaign-management-service'],
      stackTrace: `org.springframework.web.client.ResourceAccessException: I/O error on GET request for "http://cms:8080/api/v1/ch-100/playlist/asset/view"
\tat org.springframework.web.client.RestTemplate.doExecute(RestTemplate.java:791)
\tat com.tataplay.admanagement.module.playlist.service.PlaylistServiceImpl.fetchAssets(PlaylistServiceImpl.java:64)`,
      recentLogs: 'Connection refused to campaign-management-service:8080',
    },
  },
];

export const demoIncident = demoTestCases[0].request;
