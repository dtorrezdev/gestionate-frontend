import { Component } from "@angular/core";
import { StatsWidget } from "./components/stats-widget";
import { NotificationsWidget } from "./components/notifications-widget";
import { RecentSalesWidget } from "./components/recent-sales-widget";
import { BestSellingWidget } from "./components/best-sales-widget";

@Component({
    standalone: true,
    imports: [StatsWidget, NotificationsWidget, RecentSalesWidget, BestSellingWidget],
    template: `
    <div class="card">
        <div class="font-semibold text-xl mb-4">DashboardPage works!</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
    <div class="grid grid-cols-12 gap-8">
        <app-stats-widget class="contents" />
        <div class="col-span-12 xl:col-span-6">
            <app-recent-sales-widget />
            <app-best-selling-widget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <!-- <app-revenue-stream-widget /> -->
            <app-notifications-widget />
        </div>
    </div>
    `
})
export class DashboardPage {

}
