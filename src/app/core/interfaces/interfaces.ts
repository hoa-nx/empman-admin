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
    OrderNo: string;
    ReportYearMonth: Date;
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
    OrderProjectSumMM: number;
    OrderUnitMasterID: number;
    OrderUnitMasterDetailID: number;
    ExchangeRateID: number;
    CustomerUnitPriceID: number;
    OrderPrice: number;
    OrderPriceToUsd: number;
    AccPreMonthSumMM: number;
    AccPreMonthSumToUsd: number;
    InMonthDevMM: number;
    InMonthTransMM: number;
    InMonthManagementMM: number;
    InMonthOnsiteMM  : number;
    InMonthSumMM: number;
    InMonthSumIncludeOnsiteMM  : number;
    InMonthDevSumExcludeTransMM  : number;
    InMonthToUsd: number;
    InMonthToVnd: number;
    NextMonth: number;
    NextMonthMM: number;
    NextMonthToUsd: number;
    PMID: number;
    PLID: number;
    DisplayOrder: number;
    AccountData: string;
    Note: string;
    DeleteFlag: number;
    DataStatus: number;
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
    OrderNo: string;
    ReportYearMonth: Date;
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
    OrderProjectSumMM: number;
    OrderUnitMasterID: number;
    OrderUnitMasterDetailID: number;
    ExchangeRateID: number;
    CustomerUnitPriceID: number;
    OrderPrice: number;
    OrderPriceToUsd: number;
    AccPreMonthSumMM: number;
    AccPreMonthSumToUsd: number;
    InMonthDevMM: number;
    InMonthTransMM: number;
    InMonthManagementMM: number;
    InMonthOnsiteMM  : number;
    InMonthSumMM: number;
    InMonthSumIncludeOnsiteMM  : number;
    InMonthDevSumExcludeTransMM  : number;
    InMonthToUsd: number;
    InMonthToVnd: number;
    NextMonth: number;
    NextMonthMM: number;
    NextMonthToUsd: number;
    PMID: number;
    PLID: number;
    DisplayOrder: number;
    AccountData: string;
    Note: string;
    DeleteFlag: number;
    DataStatus: number;
    CreatedDate: Date;
    CreatedBy: string;
    UpdatedDate: Date;
    UpdatedBy: string;

    emps: IEmp[];
    EstimateTypes: string[];
}

export interface IRevenueStackBarChartItems {
    CompanyID: number;
    DeptID: number;
    ReportYearMonth: Date;
    MonthToName: string;
    InMonthDevMM: number;
    InMonthTransMM: number;
    InMonthManagementMM: number;
    InMonthOnsiteMM  : number;
}

export interface ITarget {
    ID: number;
    CompanyID: number;
    DeptID: number;
    TeamID: number;
    YearMonth: Date;
    Name: string;
    CreatorBy: string;
    CreateDate: Date;
    ApprovedBy: string;
    ApprovedDate: Date;
    Koritu: number;
    ActKoritu: number;
    ChangePercentEmp: number;
    ChangeEmp: number;
    ManagerEmp: number;
    Leader2Emp: number;
    Leader1Emp: number;
    SubLeader2: number;
    SubLeader1: number;
    DevEmp: number;
    TransEmp: number;
    OtherEmp: number;
    LeaveJobPercentEmp: number;
    LeaveJobEmp: number;
    ActChangePercentEmp: number;
    ActChangeEmp: number;
    ActManagerEmp: number;
    ActLeader2Emp: number;
    ActLeader1Emp: number;
    ActSubLeader2: number;
    ActSubLeader1: number;
    ActDevEmp: number;
    ActTransEmp: number;
    ActOtherEmp: number;
    ActLeaveJobPercentEmp: number;
    ActLeaveJobEmp: number;
    ChangePercentMM: number;
    ChangeMM: number;
    QuotationMM: number;
    DevMM: number;
    TransMM: number;
    OnsiteMM: number;
    ManMM: number;
    TotalMM: number;
    ActChangePercentMM: number;
    ActChangeMM: number;
    ActQuotationMM: number;
    ActDevMM: number;
    ActTransMM: number;
    ActOnsiteMM: number;
    ActManMM: number;
    ActTotalMM: number;
    N1: number;
    N2: number;
    N3: number;
    N4: number;
    N5: number;
    ActN1: number;
    ActN2: number;
    ActN3: number;
    ActN4: number;
    ActN5: number;
    LongOnsiterNumber: number;
    ShortOnsiterNumber: number;
    InterShipNumber: number;
    ActLongOnsiterNumber: number;
    ActShortOnsiterNumber: number;
    ActInterShipNumber: number;
    Reason1: string;
    Reason2: string;
    Reason3: string;


    DisplayOrder: number;
    AccountData: string;
    Note: string;
    DeleteFlag: number;
    DataStatus: number;
    CreatedDate: Date;
    CreatedBy: string;
    UpdatedDate: Date;
    UpdatedBy: string;
}

export interface ITargetDetails {
    ID: number;
    CompanyID: number;
    DeptID: number;
    TeamID: number;
    YearMonth: Date;
    Name: string;
    CreatorBy: string;
    CreateDate: Date;
    ApprovedBy: string;
    ApprovedDate: Date;
    Koritu: number;
    ActKoritu: number;
    ChangePercentEmp: number;
    ChangeEmp: number;
    ManagerEmp: number;
    Leader2Emp: number;
    Leader1Emp: number;
    SubLeader2: number;
    SubLeader1: number;
    DevEmp: number;
    TransEmp: number;
    OtherEmp: number;
    LeaveJobPercentEmp: number;
    LeaveJobEmp: number;
    ActChangePercentEmp: number;
    ActChangeEmp: number;
    ActManagerEmp: number;
    ActLeader2Emp: number;
    ActLeader1Emp: number;
    ActSubLeader2: number;
    ActSubLeader1: number;
    ActDevEmp: number;
    ActTransEmp: number;
    ActOtherEmp: number;
    ActLeaveJobPercentEmp: number;
    ActLeaveJobEmp: number;
    ChangePercentMM: number;
    ChangeMM: number;
    QuotationMM: number;
    DevMM: number;
    TransMM: number;
    OnsiteMM: number;
    ManMM: number;
    TotalMM: number;
    ActChangePercentMM: number;
    ActChangeMM: number;
    ActQuotationMM: number;
    ActDevMM: number;
    ActTransMM: number;
    ActOnsiteMM: number;
    ActManMM: number;
    ActTotalMM: number;
    N1: number;
    N2: number;
    N3: number;
    N4: number;
    N5: number;
    ActN1: number;
    ActN2: number;
    ActN3: number;
    ActN4: number;
    ActN5: number;
    LongOnsiterNumber: number;
    ShortOnsiterNumber: number;
    InterShipNumber: number;
    ActLongOnsiterNumber: number;
    ActShortOnsiterNumber: number;
    ActInterShipNumber: number;
    Reason1: string;
    Reason2: string;
    Reason3: string;


    DisplayOrder: number;
    AccountData: string;
    Note: string;
    DeleteFlag: number;
    DataStatus: number;
    CreatedDate: Date;
    CreatedBy: string;
    UpdatedDate: Date;
    UpdatedBy: string;

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
    ID?: number;
    /**Số trang hiện tại */
    Page?: number;
    /**Số trang trến 1 page */
    PageSize?: number;

    Keyword?: string;
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
    /**
     * Mảng các item kiểu bool dùng để tìm kiếm
     */
    BoolItems?: any[];

    MasterDetailItems?: IMasterDetailItemViewModel[];

    IsDev?: boolean;

    IsTrans?: boolean;

    IsLeaveJob?: boolean;

    IsBSE?: boolean;

}