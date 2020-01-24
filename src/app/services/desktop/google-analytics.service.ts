import { Injectable } from '@angular/core';
import { appConfig } from 'src/config/app.config';
import { environment } from 'src/environments/environment';
import ua from 'universal-analytics';
import { AnalyticsService } from '../../interfaces/analytics.service';
import { Config } from 'src/config/config';
import { ElectronService } from './electron.service';

@Injectable()
export class DesktopGoogleAnalyticsService implements AnalyticsService {

  private visitor: ua.visitor;
  private interval: NodeJS.Timeout;

  constructor(config: Config, private electronService: ElectronService) {
    config.waitTillLoaded().then(() => this.visitor = ua(environment.gaCode, config.uuid));
  }

  config(path: string, title?: string) {
    if (!this.visitor) { return; }
    const window = this.electronService.remote.BrowserWindow.getAllWindows()[0];
    const screen = this.electronService.remote.screen;
    const windowSize = window.getSize();
    const windowBounds = window.getBounds();
    const display = screen.getDisplayNearestPoint({ x: windowBounds.x, y: windowBounds.y });
    const params = {
      sr: `${windowSize[0]}x${windowSize[1]}`,
      vp: `${display.size.width}x${display.size.height}`
    };

    if (this.interval) {
      clearInterval(this.interval);
    }
    this.visitor
      .screenview(path, appConfig.applicationName, appConfig.version, appConfig.version, appConfig.version, params, () => { }).send();
    this.interval = setInterval(() => {
      this.visitor
        .screenview(path, appConfig.applicationName, appConfig.version, appConfig.version, appConfig.version, params, () => { }).send();
    }, 30000);
  }

  exception(error: string) {
    this.visitor.exception(error);
  }

  send(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: number) {
    if (!this.visitor) { return; }
    this.visitor.event(eventCategory, eventAction, eventLabel, eventValue).send();
  }
}
