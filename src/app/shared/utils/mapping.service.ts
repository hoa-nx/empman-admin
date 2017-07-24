import { Injectable } from '@angular/core';

import { IRevenue, IRevenueDetails, IEmp, ITargetDetails, ITarget, IRevenueStackBarChartItems } from '../../core/interfaces/interfaces';
import { ItemsService } from './items.service'
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

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
            OrderNo: revenueDetails.OrderNo,
            ReportYearMonth: revenueDetails.ReportYearMonth,
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
            CustomerUnitPriceID: revenueDetails.CustomerUnitPriceID,
            OrderPrice: revenueDetails.OrderPrice,
            OrderPriceToUsd: revenueDetails.OrderPriceToUsd,
            AccPreMonthSumMM: revenueDetails.AccPreMonthSumMM,
            AccPreMonthSumToUsd: revenueDetails.AccPreMonthSumToUsd,
            InMonthDevMM: revenueDetails.InMonthDevMM,
            InMonthTransMM: revenueDetails.InMonthTransMM,
            InMonthManagementMM: revenueDetails.InMonthManagementMM,
            InMonthOnsiteMM:  revenueDetails.InMonthOnsiteMM,
            InMonthSumMM: revenueDetails.InMonthSumMM,
            InMonthSumIncludeOnsiteMM:  revenueDetails.InMonthSumIncludeOnsiteMM,
            InMonthDevSumExcludeTransMM:  revenueDetails.InMonthDevSumExcludeTransMM,
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
            DataStatus: revenueDetails.DataStatus,

            CreatedDate: revenueDetails.CreatedDate,
            CreatedBy: revenueDetails.CreatedBy,
            UpdatedDate: revenueDetails.UpdatedDate,
            UpdatedBy: revenueDetails.UpdatedBy


            //attendees: this.itemsService.getPropertyValues<IUser, number[]>(scheduleDetails.attendees, 'id')

        }

        return revenue;
    }

    mapTargetDetailsToTarget(revenueDetails: ITargetDetails): ITarget {
        var target: ITarget = {
            ID: revenueDetails.ID,
            CompanyID: revenueDetails.CompanyID,
            DeptID: revenueDetails.DeptID,
            TeamID: revenueDetails.TeamID,
            YearMonth: revenueDetails.YearMonth,
            Name: revenueDetails.Name,
            CreatorBy: revenueDetails.CreatorBy,
            CreateDate: revenueDetails.CreateDate,
            ApprovedBy: revenueDetails.ApprovedBy,
            ApprovedDate: revenueDetails.ApprovedDate,
            Koritu: revenueDetails.Koritu,
            ActKoritu: revenueDetails.ActKoritu,
            ChangePercentEmp: revenueDetails.ChangePercentEmp,
            ChangeEmp: revenueDetails.ChangeEmp,
            ManagerEmp: revenueDetails.ManagerEmp,
            Leader2Emp: revenueDetails.Leader2Emp,
            Leader1Emp: revenueDetails.Leader1Emp,
            SubLeader2: revenueDetails.SubLeader2,
            SubLeader1: revenueDetails.SubLeader1,
            DevEmp: revenueDetails.DevEmp,
            TransEmp: revenueDetails.TransEmp,
            OtherEmp: revenueDetails.OtherEmp,
            LeaveJobPercentEmp: revenueDetails.LeaveJobPercentEmp,
            LeaveJobEmp: revenueDetails.LeaveJobEmp,
            ActChangePercentEmp: revenueDetails.ActChangePercentEmp,
            ActChangeEmp: revenueDetails.ActChangeEmp,
            ActManagerEmp: revenueDetails.ActManagerEmp,
            ActLeader2Emp: revenueDetails.ActLeader2Emp,
            ActLeader1Emp: revenueDetails.ActLeader1Emp,
            ActSubLeader2: revenueDetails.ActSubLeader2,
            ActSubLeader1: revenueDetails.ActSubLeader1,
            ActDevEmp: revenueDetails.ActDevEmp,
            ActTransEmp: revenueDetails.ActTransEmp,
            ActOtherEmp: revenueDetails.ActOtherEmp,
            ActLeaveJobPercentEmp: revenueDetails.ActLeaveJobPercentEmp,
            ActLeaveJobEmp: revenueDetails.ActLeaveJobEmp,
            ChangePercentMM: revenueDetails.ChangePercentMM,
            ChangeMM: revenueDetails.ChangeMM,
            QuotationMM: revenueDetails.QuotationMM,
            DevMM: revenueDetails.DevMM,
            TransMM: revenueDetails.TransMM,
            OnsiteMM: revenueDetails.OnsiteMM,
            ManMM: revenueDetails.ManMM,
            TotalMM: revenueDetails.TotalMM,
            ActChangePercentMM: revenueDetails.ActChangePercentMM,
            ActChangeMM: revenueDetails.ActChangeMM,
            ActQuotationMM: revenueDetails.ActQuotationMM,
            ActDevMM: revenueDetails.ActDevMM,
            ActTransMM: revenueDetails.ActTransMM,
            ActOnsiteMM: revenueDetails.ActOnsiteMM,
            ActManMM: revenueDetails.ActManMM,
            ActTotalMM: revenueDetails.ActTotalMM,
            N1: revenueDetails.N1,
            N2: revenueDetails.N2,
            N3: revenueDetails.N3,
            N4: revenueDetails.N4,
            N5: revenueDetails.N5,
            ActN1: revenueDetails.ActN1,
            ActN2: revenueDetails.ActN2,
            ActN3: revenueDetails.ActN3,
            ActN4: revenueDetails.ActN4,
            ActN5: revenueDetails.ActN5,
            LongOnsiterNumber: revenueDetails.LongOnsiterNumber,
            ShortOnsiterNumber: revenueDetails.ShortOnsiterNumber,
            InterShipNumber: revenueDetails.InterShipNumber,
            ActLongOnsiterNumber: revenueDetails.ActLongOnsiterNumber,
            ActShortOnsiterNumber: revenueDetails.ActShortOnsiterNumber,
            ActInterShipNumber: revenueDetails.ActInterShipNumber,
            Reason1: revenueDetails.Reason1,
            Reason2: revenueDetails.Reason2,
            Reason3: revenueDetails.Reason3,

            DisplayOrder: revenueDetails.DisplayOrder,
            AccountData: revenueDetails.AccountData,
            Note: revenueDetails.Note,
            DeleteFlag: revenueDetails.DeleteFlag,
            DataStatus: revenueDetails.DataStatus,

            CreatedDate: revenueDetails.CreatedDate,
            CreatedBy: revenueDetails.CreatedBy,
            UpdatedDate: revenueDetails.UpdatedDate,
            UpdatedBy: revenueDetails.UpdatedBy,


            //attendees: this.itemsService.getPropertyValues<IUser, number[]>(scheduleDetails.attendees, 'id')

        }

        return target;
    }


    public static mapIdNameToDropdownModel(data: any[]) {
        let model: IMultiSelectOption[] = [];
        data.map(item => {
            model.push({
                id: item.ID,
                name: item.Name
            });
        });
        return model;
    }

    public static mapYearMonhToDropdownModel(data: any[]) {
        let model: IMultiSelectOption[] = [];
        data.map(item => {
            model.push({
                id: item.id,
                name: item.name
            });
        });
        return model;
    }

    public static mapToRevenueForJGrid(data: any[]) {
        let jGridModel: any[] = [];
        data.map(revenueDetails => {
            jGridModel.push({
                ID: revenueDetails.ID,
                /*CompanyID: revenueDetails.CompanyID,
                DeptID: revenueDetails.DeptID,
                TeamID: revenueDetails.TeamID,
                ReporterID: revenueDetails.ReporterID,
                ReportDate: revenueDetails.ReportDate,*/
                OrderNo: revenueDetails.OrderNo,
                ReportYearMonth: revenueDetails.ReportYearMonth,
                /*ProjectInMonthCount: revenueDetails.ProjectInMonthCount,
                ReportTitle: revenueDetails.ReportTitle,
                ProjectID: revenueDetails.ProjectID,
                ProjectDetailID: revenueDetails.ProjectDetailID,
                ProjectName: revenueDetails.ProjectName,*/
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
                CustomerUnitPriceID: revenueDetails.CustomerUnitPriceID,
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
                /*NextMonth: revenueDetails.NextMonth,*/
                NextMonthMM: revenueDetails.NextMonthMM,
                NextMonthToUsd: revenueDetails.NextMonthToUsd,
                /*PMID: revenueDetails.PMID,
                PLID: revenueDetails.PLID,
                DisplayOrder: revenueDetails.DisplayOrder,
                AccountData: revenueDetails.AccountData,*/
                Note: revenueDetails.Note
                /*DeleteFlag: revenueDetails.DeleteFlag,
                DataStatus: revenueDetails.DataStatus,
                CreatedDate: revenueDetails.CreatedDate,
                CreatedBy: revenueDetails.CreatedBy,
                UpdatedDate: revenueDetails.UpdatedDate,
                UpdatedBy: revenueDetails.UpdatedBy*/
            });
        });
        return jGridModel;
    }

    //IRevenueStackBarChartItems
    public static mapToRevenueStackBarChartItems(data: any[]) {
        let model: IRevenueStackBarChartItems[] = [];
        data.map(item => {
            model.push({
                CompanyID: item.CompanyID,
                DeptID: item.DeptID,
                ReportYearMonth: item.ReportYearMonth,
                MonthToName: item.MonthToName,
                InMonthDevMM: item.InMonthDevMM,
                InMonthTransMM: item.InMonthTransMM,
                InMonthManagementMM: item.InMonthManagementMM,
                InMonthOnsiteMM  : item.InMonthOnsiteMM 
            });
        });
        return model;
    }

}