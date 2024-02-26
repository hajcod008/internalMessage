import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  Bad_Request_Exception,
  DataNotFound,
  Invalid_Captcha,
  Invalid_Token,
  Something_Went_Wrong,
  Unauthorized,
  expireTime,
} from '../translate/errors.translate';
import {
  Request_Was_Successful,
  Request_Was_Successful1,
} from '../translate/success.translate';
import { compilerLogger, infoLogger } from 'src/configs/winston/winston.config';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const generalError = exception.getResponse();
    let language = (request.headers['language'] as string) || 'en';
    if (!language) {
      language = 'en';
    }
    let result: any;
    let message: string;
    if (generalError.response) {
      result = {
        status_code: generalError.response.status_code,
        error_code: generalError.response.code,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      message = generalError.response.message[language];
    } else if (generalError.response !== undefined) {
      result = {
        status_code: generalError.response.status_code,
        error_code: generalError.response.code,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      message = generalError.response.message[language];
    } else if (generalError.status_code === 200) {
      result = {
        success: true,
        status_code: generalError.status_code,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      message = generalError.message[language];
    } else if (exception.status === 401) {
      result = {
        status_code: Unauthorized.status_code,
        error_code: Unauthorized.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = Unauthorized.message[language];
    } else if (exception.status === 402) {
      result = {
        status_code: Invalid_Token.status_code,
        error_code: Invalid_Token.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = Invalid_Token.message[language];
    } else if (exception.status === 400) {
      result = {
        status_code: Bad_Request_Exception.status_code,
        error_code: Bad_Request_Exception.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
        //TODO : remove this line from
      };
      message = Bad_Request_Exception.message[language];
    } else if (exception.status === 408) {
      result = {
        status_code: expireTime.status_code,
        error_code: expireTime.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = expireTime.message[language];
    } else if (exception.status === 403) {
      result = {
        status_code: Invalid_Captcha.status_code,
        error_code: Invalid_Captcha.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = Invalid_Captcha.message[language];
    } else if (exception.status === 409) {
      result = {
        status_code: DataNotFound.status_code,
        error_code: DataNotFound.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = DataNotFound.message[language];
    } else if (exception.status === 201) {
      const format2 = Request_Was_Successful(exception.additional_info);
      result = {
        success: true,
        status_code: format2.status_code,
        error_code: format2.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = Request_Was_Successful1.message[language];
    } else if (exception.status === 200) {
      result = {
        success: true,
        status_code: Request_Was_Successful1.status_code,
        error_code: Request_Was_Successful1.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: exception.getResponse().message,
      };
      message = Request_Was_Successful1.message[language];
    } else {
      result = {
        status_code: Something_Went_Wrong.status_code,
        error_code: Something_Went_Wrong.code,
        timestamp: new Date().toISOString(),
        path: request.url,
        message_developer: Something_Went_Wrong.message[language],
      };
      message = exception.message;
    }
    response
      .status(result.status_code)
      .json({ success: result.success, result: result, message: message });
    if (result.status_code === 500) {
      compilerLogger.compiler(result);
    } else {
      infoLogger.info(result);
    }
  }
}
