import { Injectable } from '@angular/core';

import { IRevenue, IRevenueDetails, IEmp } from '../../core/interfaces/interfaces';
import { ItemsService } from './items.service'

@Injectable()
export class MappingService {

    constructor(private itemsService: ItemsService) { }

    mapRevenueDetailsToRevenue(revenueDetails: IRevenueDetails): IRevenue {
        var revenue: IRevenue = {
            ID: revenueDetails.ID,
            CompanyID: revenueDetails.CompanyID,
            DeptID: revenueDetails.DeptID,
            TeamID: revenueDetails.TeamID,
            ReporterID: revenueDetails.ReporterID,
            ReportDate: revenueDetails.ReportDate,
            ReportYearMonth: revenueDetails.ReportYearMonth,
            OrderNo: revenueDetails.OrderNo,
            ProjectInMonthCount: revenueDetails.ProjectInMonthCount,
            ReportTitle: revenueDetails.ReportTitle,
            ProjectID: revenueDetails.ProjectID,
            ProjectDetailID: revenueDetails.ProjectDetailID,
            ProjectName: revenueDetails.ProjectName,
            ProjectContent: revenueDetails.ProjectContent,
            EstimateTypeMasterID: revenueDetails.EstimateTypeMasterID,
            EstimateTypeMasterDetailID: revenueDetails.EstimateTypeMasterDetailID,
            CustomerID: revenueDetails.CustomerID,
            CustomerName: revenueDetails.CustomerName,
            OrderStartDate: revenueDetails.OrderStartDate,
            OrderEndDate: revenueDetails.OrderEndDate,
            OrderProjectSumMM: revenueDetails.OrderProjectSumMM,
            OrderUnitMasterID: revenueDetails.OrderUnitMasterID,
            OrderUnitMasterDetailID: revenueDetails.OrderUnitMasterDetailID,
            ExchangeRateID: revenueDetails.ExchangeRateID,
            OrderPrice: revenueDetails.OrderPrice,
            OrderPriceToUsd: revenueDetails.OrderPriceToUsd,
            AccPreMonthSumMM: revenueDetails.AccPreMonthSumMM,
            AccPreMonthSumToUsd: revenueDetails.AccPreMonthSumToUsd,
            InMonthDevMM: revenueDetails.InMonthDevMM,
            InMonthTransMM: revenueDetails.InMonthTransMM,
            InMonthManagementMM: revenueDetails.InMonthManagementMM,
            InMonthSumMM: revenueDetails.InMonthSumMM,
            InMonthToUsd: revenueDetails.InMonthToUsd,
            InMonthToVnd: revenueDetails.InMonthToVnd,
            NextMonth: revenueDetails.NextMonth,
            NextMonthMM: revenueDetails.NextMonthMM,
            NextMonthToUsd: revenueDetails.NextMonthToUsd,
            PMID: revenueDetails.PMID,
            PLID: revenueDetails.PLID,
            DisplayOrder: revenueDetails.DisplayOrder,
            AccountData: revenueDetails.AccountData,
            Note: revenueDetails.Note,
            DeleteFlag: revenueDetails.DeleteFlag,
            Status: revenueDetails.Status,
            CreatedDate: revenueDetails.CreatedDate,
            CreatedBy: revenueDetails.CreatedBy,
            UpdatedDate: revenueDetails.UpdatedDate,
            UpdatedBy: revenueDetails.UpdatedBy

            //attendees: this.itemsService.getPropertyValues<IUser, number[]>(scheduleDetails.attendees, 'id')

        }

        return revenue;
    }

}