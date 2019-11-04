import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MetaLoader, MetaModule, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { appConfig } from 'src/config/app.config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultComponent } from './components/default/default.component';
import { LoggerService, LoggerServiceToken } from './interfaces/logger.service';
import { ApiService } from './services/api.service';
import { CommonErrorHandler } from './services/common-error.handler';
import { CustomMissingTranslationHandler } from './services/custom-missing-translation.handler';
import { LocatorService } from './services/locator.service';
import { ResizeService } from './services/resize.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { environment } from 'src/environments/environment';
import { DummyAnalyticsService } from './services/dummy-analytics.service';
import { AnalyticsServiceToken } from './interfaces/analytics.service';
import { ClientIdHttpInterceptor } from './services/client-id.http-interceptor';

const translateHttpLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

const missingTranslationHandler = (loggerServiceDepHolder: LoggerServiceDepHolder) => {
  return new CustomMissingTranslationHandler(loggerServiceDepHolder.loggerService);
};

@Injectable()
export class LoggerServiceDepHolder {
  constructor(@Inject(LoggerServiceToken) public loggerService: LoggerService) {
  }
}

const metaFactory = (translate: TranslateService) => {
  return new MetaStaticLoader({
    callback: (key: string) => translate.get(key),
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: appConfig.applicationName,
    defaults: {
      title: appConfig.defautTitle
    }
  });
};

const analyticsServiceFactory = () => {
  return environment.production ? new GoogleAnalyticsService() : new DummyAnalyticsService();
}

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent
  ],
  exports: [
    AppComponent,
    DefaultComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: (translateHttpLoader),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: (missingTranslationHandler),
        deps: [LoggerServiceDepHolder]
      }
    }),
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (metaFactory),
      deps: [TranslateService]
    })
  ],
  providers: [
    { provide: ErrorHandler, useClass: CommonErrorHandler },
    ApiService,
    ResizeService,
    LoggerServiceDepHolder,
    MessageService,
    { provide: AnalyticsServiceToken, useFactory: analyticsServiceFactory },
    ClientIdHttpInterceptor
  ]
})
export class AppSharedModule {
  constructor(injector: Injector) {
    LocatorService.Injector = injector;
  }
}
