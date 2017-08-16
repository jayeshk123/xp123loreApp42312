//
//  showListViewTableViewController.swift
//  TestWV
//
//  Created by earth on 28/07/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import NVActivityIndicatorView
import Alamofire
import SwiftyJSON



struct SubSections{
    var title:String
    var location:String
    var distance:String
    var status:String
    var image:String
}

class showListViewTableViewController: UITableViewController, NVActivityIndicatorViewable {
    
    var URL = "http://34.231.31.72/xplore/index.php"


    @IBAction func backBtnClicked(_ sender: UIBarButtonItem) {
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let newViewController = storyBoard.instantiateViewController(withIdentifier: "nativeDiscoverController")
        self.present(newViewController, animated: true, completion: nil)
    }
    
    var sections = [String]()
    var subsections:[SubSections] = []
    var positionArray = [Int]()
    var countArray = [Int]()
    var cell1Array = [Int]()
    var cell2Array = [Int]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        getSections()
        self.tableView.backgroundColor = UIColor.black
        
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    
    var dbQueue: DatabaseQueue!
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        print("DATABASE PATH !!!!")
        print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            print("writing to documents directory")
            print(databasePath)
            //break
            return
        }
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            print("writing from app bundle")
            if (success)
            {
                try! fileManager.copyItem(atPath: bundlePath!, toPath: databasePath)
                dbQueue = try! DatabaseQueue(path: databasePath)
            }
            else
            {
                print("Could not find database")
            }
            return
        }
    }
    
    public func getSections(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            var i = -1;
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM eatList")! // Int
                
                print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM eatList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        sections.append(sectionName)
                        //i = i+1
                        //positionArray.append(i)
                    }
                
                }
            }
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM drinkList")! // Int
                
                print("Count : \(elCount)")
                
            }
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM drinkList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        sections.append(sectionName)
                        //i = i+1
                        //positionArray.append(i)
                    }
                    
                }
            }
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM listenList")! // Int
                
                print("Count : \(elCount)")
                
            }
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM listenList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        sections.append(sectionName)
                        //i = i+1
                        //positionArray.append(i)
                    }
                    
                }
            }
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM watchList")! // Int
                
                print("Count : \(elCount)")
                
            }
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM watchList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        sections.append(sectionName)
                        //i = i+1
                        //positionArray.append(i)
                    }
                    
                }
            }
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM doList")! // Int
                
                print("Count : \(elCount)")
                
            }
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM doList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        sections.append(sectionName)
                        //i = i+1
                       // positionArray.append(i)
                    }
                    
                }
            }
            
            print(sections)
            print(positionArray)
            print(countArray)
            let dispatchGroup = DispatchGroup()
            if(sections.count > 0){
                
                for j in 0..<sections.count{
                    let silentString = sections[j].lowercased()
                    //print(silentString)
                    let trimmedString = silentString.replacingOccurrences(of: " ", with: "")
                    //print(trimmedString)
                    let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
                    NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
                    i = i+1
                    positionArray.append(1)
                    cell1Array.append(i)
                    dispatchGroup.enter()
                    Alamofire.request(URL+"/site/getSelectedPlaceNative?Category="+trimmedString+"&page_num=1").responseString { response in
                        print("Request: \(String(describing: response.request))")   // original url request
                        print("Response: \(String(describing: response.response))") // http url response
                        print("Result: \(response.result)")                         // response serialization result
                        
                        if let json = response.data {
                            let data = JSON(data: json)
                            self.countArray.append(data.count)
                            
                            if(data.count > 0){
                                for k in 0..<data.count{
                                    i = i+1
                                    self.positionArray.append(2)
                                    self.cell2Array.append(i)
                                    let json1 = data[k]["Detail"]
                                    print("data \(json1["name"])")
                                    //self.positionArray.insert(2, at: indexPath.row+1)
                                    self.subsections.append(SubSections(title: json1["name"].string!, location: json1["address"].string!, distance: "1 mi away", status: "OPEN", image : json1["Path"].string!))
                                    NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
                                    self.tableView.reloadData()
                                }
                                
                            }
                            //let data1 = JSON(String: json1)
                            //print("data1 \(data1)")
                        }
                        
                    }
                    dispatchGroup.leave()

                }
                
            }
            
            
            
        } catch {
            print(error.localizedDescription)
        }
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    /*override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return self.sections [section]
    }*/

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return self.sections.count + self.subsections.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        print(cell1Array)
        print(cell2Array)
        print(countArray)
        print(positionArray)
        
        
        
        
        for i in 0..<cell1Array.count{
            if(cell1Array[i] ==  indexPath.row){
                let cell = Bundle.main.loadNibNamed("showListTableViewCell", owner: self, options: nil)?.first as! showListTableViewCell
                
                cell.backgroundColor = UIColor.black
                
                cell.downArrowImage.image = UIImage(named: "down")
                cell.downArrowImage.contentMode = .scaleAspectFit
                cell.categoryTitle.text = sections[cell1Array[i]]
                cell.categoryTitle.textColor = UIColor.white
                return cell
            }
        }
        
        for j in 0..<cell2Array.count{
            if(cell2Array[j] ==  indexPath.row){
                let cell = Bundle.main.loadNibNamed("ShowListSubSectionsTableViewCell", owner: self, options: nil)?.first as! ShowListSubSectionsTableViewCell
                
                cell.backgroundColor = UIColor.black
                let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/"+subsections[0].image)! as URL
                print("Download Started")
                getDataFromUrl(url: imageUrl) { (data, response, error)  in
                    guard let data = data, error == nil else { return }
                    print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                    print("Download Finished")
                    DispatchQueue.main.async() { () -> Void in
                        cell.leftImage.image = UIImage(data: data)
                        cell.leftImage.contentMode = .scaleAspectFit
                    }
                }
                print("End of code. The image will continue downloading in the background and it will be loaded when it ends.")
                cell.rightImage.image = nil
                cell.titleLabel.text = subsections[0].title
                cell.locationLabel.text = subsections[0].location
                cell.distanceLabel.text = subsections[0].distance
                cell.statusLabel.text = subsections[0].status
                
                return cell

            }
            
        }
        /*if(self.positionArray[indexPath.row] == 1){
            let cell = Bundle.main.loadNibNamed("ShowListSubSectionsTableViewCell", owner: self, options: nil)?.first as! ShowListSubSectionsTableViewCell
            
            cell.backgroundColor = UIColor.black
            let imageUrl = NSURL(string: "https://s3.amazonaws.com/retail-safari/"+subsections[0].image)! as URL
            print("Download Started")
            getDataFromUrl(url: imageUrl) { (data, response, error)  in
                guard let data = data, error == nil else { return }
                print(response?.suggestedFilename ?? imageUrl.lastPathComponent)
                print("Download Finished")
                DispatchQueue.main.async() { () -> Void in
                    cell.leftImage.image = UIImage(data: data)
                    cell.leftImage.contentMode = .scaleAspectFit
                }
            }
            print("End of code. The image will continue downloading in the background and it will be loaded when it ends.")
            cell.rightImage.image = nil
            cell.titleLabel.text = subsections[0].title
            cell.locationLabel.text = subsections[0].location
            cell.distanceLabel.text = subsections[0].distance
            cell.statusLabel.text = subsections[0].status
            
            return cell
        }*/
        let cell = Bundle.main.loadNibNamed("showListTableViewCell", owner: self, options: nil)?.first as! showListTableViewCell
        
        cell.backgroundColor = UIColor.black
        
        return cell
    }
    
    func getDataFromUrl(url: URL, completion: @escaping (_ data: Data?, _  response: URLResponse?, _ error: Error?) -> Void) {
        URLSession.shared.dataTask(with: url) {
            (data, response, error) in
            completion(data, response, error)
            }.resume()
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        print(subsections)
        if(self.positionArray[indexPath.row] == 1){
            print(sections[indexPath.row])
            let silentString = sections[indexPath.row].lowercased()
            print(silentString)
            let trimmedString = silentString.replacingOccurrences(of: " ", with: "")
            print(trimmedString)
            let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
            NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)

            Alamofire.request(URL+"/site/getSelectedPlaceNative?Category="+trimmedString+"&page_num=1").responseJSON { response in
                print("Request: \(String(describing: response.request))")   // original url request
                print("Response: \(String(describing: response.response))") // http url response
                print("Result: \(response.result)")                         // response serialization result
            
                if let json = response.data {
                    let data = JSON(data: json)
                
                    if(data.count > 0){
                        let json1 = data[0]["Detail"]
                        print("data \(json1["name"])")
                        self.positionArray.insert(2, at: indexPath.row+1)
                        self.subsections.append(SubSections(title: json1["name"].string!, location: json1["address"].string!, distance: "1 mi away", status: "OPEN", image : json1["Path"].string!))
                        tableView.reloadData()
                    }
                    //let data1 = JSON(String: json1)
                    //print("data1 \(data1)")
                }
            
                NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
            }
        }
        
        
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60.0
    }
    

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
