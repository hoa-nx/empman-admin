export interface IEmp {
    ID: number;
    No: number;
    FullName: string;
    Name?: string;
    Furigana?: string;
    Gender?: boolean;
    IdentNo?: string;
    IdentDate?: Date;
    IdentPlace?: string;
    ExtLinkNo?: string;
    TrainingProfileNo?: string;
    BornPlace?: string;
    Avatar?: string;
    ShowAvatar?: boolean;
    WorkingEmail?: string;
    PersonalEmail?: string;
    BirthDay?: Date;
    AccountName?: string;
    PhoneNumber1?: string;
    PhoneNumber2?: string;
    PhoneNumber3?: string;
    Address1?: string;
    Address2?: string;
    CurrentDeptID?: number;
    CurrentTeamID?: number;
    CurrentPositionID?: number;
    StartWorkingDate?: any;
    StartLearningDate?: Date;
    EndLearningDate?: Date;
    StartTrialDate?: Date;
    EndTrialDate?: Date;
    ContractDate?: Date;
    ContractTypeMasterID?: number;
    ContractTypeMasterDetailID?: number;
    JobLeaveRequestDate?: Date;
    JobLeaveDate?: Date;
    IsJobLeave?: boolean;
    JobLeaveReason?: string;
    GoogleId?: string;
    MarriedDate?: Date;
    ExperienceBeforeContent?: string;
    ExperienceBeforeConvert?: string;
    ExperienceConvert?: string;
    EmpTypeMasterID?: number;
    EmpTypeMasterDetailID?: number;
    IsBSE?: boolean;
    CollectMasterID?: number;
    CollectMasterDetailID?: number;
    EducationLevelMasterID?: number;
    EducationLevelMasterDetailID?: number;
    Temperament?: string;
    Introductor?: string;
    BloodGroup?: string;
    Hobby?: string;
    Objective?: string;
    FileID?: number;
    ProfileAttachmentID?: number;
    DisplayOrder?: number;
    AccountData?: string;
    Note?: string;
    DeleteFlag?: number;
    Status?: number;
    CreatedDate?: Date;
    CreatedBy?: string;
    UpdatedDate?: Date;
    UpdatedBy?: string;
    MetaKeyword?: string;
    MetaDescription?: string;

}

export interface IRevenue {
    ID: number;
    CompanyID: number;
    DeptID: number;
    TeamID: number;
    ReporterID: number;
    ReportDate: Date;
    ReportYearMonth: Date;
    OrderNo: string;
    ProjectInMonthCount: number;
    ReportTitle: string;
    ProjectID: number;
    ProjectDetailID: number;
    ProjectName: string;
    ProjectContent: string;
    EstimateTypeMasterID: number;
    EstimateTypeMasterDetailID: number;
    CustomerID: number;
    CustomerName: string;
    OrderStartDate: Date;
    OrderEndDate: Date;
    OrderProjectSumMM: string;
    OrderUnitMasterID: number;
    OrderUnitMasterDetailID: number;
    ExchangeRateID: number;
    OrderPrice: string;
    OrderPriceToUsd: string;
    AccPreMonthSumMM: string;
    AccPreMonthSumToUsd: string;
    InMonthDevMM: string;
    InMonthTransMM: string;
    InMonthManagementMM: string;
    InMonthSumMM: string;
    InMonthToUsd: string;
    InMonthToVnd: string;
    NextMonth: string;
    NextMonthMM: string;
    NextMonthToUsd: string;
    PMID: number;
    PLID: number;
    DisplayOrder: number;
    AccountData: string;
    Note: string;
    DeleteFlag: number;
    Status: number;
    CreatedDate: Date;
    CreatedBy: string;
    UpdatedDate: Date;
    UpdatedBy: string;


}

export interface IRevenueDetails {
    ID: number;
    CompanyID: number;
    DeptID: number;
    TeamID: number;
    ReporterID: number;
    ReportDate: Date;
    ReportYearMonth: Date;
    OrderNo: string;
    ProjectInMonthCount: number;
    ReportTitle: string;
    ProjectID: number;
    ProjectDetailID: number;
    ProjectName: string;
    ProjectContent: string;
    EstimateTypeMasterID: number;
    EstimateTypeMasterDetailID: number;
    CustomerID: number;
    CustomerName: string;
    OrderStartDate: Date;
    OrderEndDate: Date;
    OrderProjectSumMM: string;
    OrderUnitMasterID: number;
    OrderUnitMasterDetailID: number;
    ExchangeRateID: number;
    OrderPrice: string;
    OrderPriceToUsd: string;
    AccPreMonthSumMM: string;
    AccPreMonthSumToUsd: string;
    InMonthDevMM: string;
    InMonthTransMM: string;
    InMonthManagementMM: string;
    InMonthSumMM: string;
    InMonthToUsd: string;
    InMonthToVnd: string;
    NextMonth: string;
    NextMonthMM: string;
    NextMonthToUsd: string;
    PMID: number;
    PLID: number;
    DisplayOrder: number;
    AccountData: string;
    Note: string;
    DeleteFlag: number;
    Status: number;
    CreatedDate: Date;
    CreatedBy: string;
    UpdatedDate: Date;
    UpdatedBy: string;

    emps: IEmp[];
    EstimateTypes: string[];
}

export interface ISchedule {
    id: number;
    title: string;
    description: string;
    timeStart: Date;
    timeEnd: Date;
    location: string;
    type: string;
    status: string;
    dateCreated: Date;
    dateUpdated: Date;
    creator: string;
    creatorId: number;
    attendees: number[];
}

export interface IScheduleDetails {
    id: number;
    title: string;
    description: string;
    timeStart: Date;
    timeEnd: Date;
    location: string;
    type: string;
    status: string;
    dateCreated: Date;
    dateUpdated: Date;
    creator: string;
    creatorId: number;
    attendees: IEmp[];
    statuses: string[];
    types: string[];
}

export interface Pagination {
    CurrentPage: number;
    ItemsPerPage: number;
    TotalItems: number;
    TotalPages: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}

export interface Predicate<T> {
    (item: T): boolean
}

export interface TreeItem {
    text: string;
    value: any;
    disabled?: boolean;
    checked?: boolean;
    collapsed?: boolean;
    children?: TreeItem[];
}

/** kiểu dữ liệu để lưu trữ item search dạng master - detail code */
export interface IMasterDetailItemViewModel {
    MasterID?: number;
    DetailID?: number;
}

/** Kiểu dữ liệu để chứa các hạng mục điều kiện dùng để tìm kiếm */
export interface ISearchItemViewModel {

    /** ID */
    ID? : number;
    /**Số trang hiện tại */
    Page? : number;
    /**Số trang trến 1 page */
    PageSize? : number;

    Keyword? : string;
    /**
     * Mảng các số dùng để tìm kiếm
     */
    NumberItems?: any[];
    /**
     * Mảng các chuỗi  dùng để tìm kiếm
     */
    StringItems?: string[];
    /**
     * Mảng các item kiểu ngày dùng để tìm kiếm
     */
    DateTimeItems?: any[];

    MasterDetailItems? : IMasterDetailItemViewModel[];
     
    IsDev?: boolean;

    IsTrans?: boolean;

    IsLeaveJob?: boolean;

    IsBSE?: boolean;

}