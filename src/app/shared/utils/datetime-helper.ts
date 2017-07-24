import * as moment from 'moment';
import { SystemConstants } from '../../core/common/system.constants';

/**
 * Xử lý các dữ liệu liên quan đến ngày tháng
 * Format của Date thi hãy cho là setting trong hằng số common
 */
export class DateTimeHelper {


    /**
     * Trả về ngày tháng năm
     */
    public static getCurrentDate() {
        return moment().format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trả về tháng năm hiện tại ( YYYY/MM/01)
     */
    public static getCurrentYearMonth() {
        return moment().format(SystemConstants.DATE_MOMENT_YM01_FORMAT_JP);
    }

    /**
     * Trả về năm hiện tại
     */
    public static getCurrentYear() {
        return moment().format(SystemConstants.DATE_MOMENT_Y0101_FORMAT_JP);
    }

    /**
     * Trả về ngày tháng năm tiếp theo của tháng truyền vào
     */
    public static getNextYearMonth(date: any) {
        return moment(date).add(1, 'M').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trả về ngày bắt đầu của tháng truyền vào
     */
    public static getStartDate(date: any) {
        return moment(date).startOf('month').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trả về ngày kết thúc của tháng truyền vào
     */
    public static getEndDate(date: any) {
        return moment(date).endOf('month').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trả về ngày bắt đầu của tháng truyền vào
     */
    public static getStartDateWithSime(date: any, sime: number) {
        let startDate : any;  
        
        if(sime===31){
             startDate= moment(date).startOf('month');
        }else{
            let endDate = this.getEndDateWithSime(date, sime);
            //lay ngay cuoi thang - 1 thang va cong them 1 ngay
            let preMonth = moment(endDate).subtract(1, 'months');
            //console.log('preMonth :' + preMonth.format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP));
            startDate = moment(preMonth).add(1,'d');
        }
        //console.log('startDate :' + startDate.format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP));
        return startDate.format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trả về ngày kết thúc của tháng truyền vào
     */
    public static getEndDateWithSime(date: any, sime: number) {
        let startDate = moment(date).startOf('month');
        var endDate = moment(date).endOf('month');
        if (sime===31){ //ngày kế sổ là cuối tháng
            
        }else{
            let day = new Date(startDate.year() , startDate.month(), sime);
            endDate = moment(day);
        }
        return endDate.format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Cộng thêm n ngày 
     */
    public static addDays(date: any, day: number) {
        return moment(date).add(day, 'd').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trừ bớt  n  ngày
     */
    public static minusDays(date: any, day: number) {
        return moment(date).subtract(day, 'd').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Cộng thêm n tháng 
     */
    public static addMonths(date: any, month: number) {
        return moment(date).add(month, 'M').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Trừ bớt n tháng 
     */
    public static minusMonths(date: any, month: number) {
        return moment(date).subtract(month, 'M').format(SystemConstants.DATE_MOMENT_YMD_FORMAT_JP);
    }

    /**
     * Cộng thêm n năm 
     */
    public static addYears(date: any, year: number) {

    }

    /**
     * Trừ bớt n năm 
     */
    public static minusYears(date: any, month: number) {

    }

    /**
     * Tính số tháng giữa 2 ngày truyền vào
     */
    public static monthBetween(dateStart: any, dateEnd: any) {
        let timeValues = [];

        while (dateEnd > dateStart) {
            timeValues.push(dateStart.format('YYYY/MM'));
            dateStart.add(1, 'month');
        }
        return timeValues.length;
    }


}