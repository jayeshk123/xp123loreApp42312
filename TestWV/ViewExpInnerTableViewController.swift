//
//  ViewExpInnerTableViewController.swift
//  TestWV
//
//  Created by earth on 21/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import NVActivityIndicatorView
import Alamofire
import SwiftyJSON
import CoreLocation

class ViewExpInnerTableViewController: UITableViewController {

    struct SubSections{
        var title:String
        var desc:String
        var like:String
        var share:String
        var image:String
        var expList:Array<String>
    }
    
    var dbQueue: DatabaseQueue!
    var sec_URL = String()
    var sections = [String]()
    var subsections:[SubSections] = []
    var positionArray = [Int]()
    var countArray = [Int]()
    var cell1Array = [Int]()
    var cell2Array = [Int]()
    var selectedArray = [Int]()
    
    let locManager = CLLocationManager()
    var locationManager = CLLocationManager()
    var latCenter:Double? = nil
    var longCenter:Double? = nil
    
    @IBOutlet weak var backBtn: UIBarButtonItem!
    var URL = "http://34.231.31.72/xplore/index.php"
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        //print("DATABASE PATH !!!!")
        //print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            //print("writing to documents directory")
            //print(databasePath)
            //break
            return
        }
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            //print("writing from app bundle")
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
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM selectList")! // Int
                
                //print("Count : \(elCount)")
                
            }
            
       /*
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM selectList")
                    while let row = try rows.next() {
                        let sectionName: String = row.value(named: "sectionName")
                        
                        let sectionURL: String = row.value(named: "sectionURL")
                        self.sec_URL = sectionURL
                        self.backBtn.title = "< "+sectionName
                    }
                    
                }
            }
            
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM selectedPlaces")! // Int
                
                //print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM selectedPlaces")
                    while let row = try rows.next() {
                        let uniqueID : String = row.value(named: "uniqueID")
                        
                        selectedArray.append(Int(uniqueID)!)
                        print(selectedArray)
                    }
                    
                }
            }*/
            
            sec_URL = URL+"/site/getAllExperienceNative"
            let activityData = ActivityData(type: NVActivityIndicatorType.ballSpinFadeLoader)
            NVActivityIndicatorPresenter.sharedInstance.startAnimating(activityData)
            Alamofire.request(self.sec_URL).responseString { response in
                print("Request: \(String(describing: response.request))")   // original url request
                print("Response: \(String(describing: response.response))") // http url response
                print("Result: \(response.result)")                         // response serialization result
                
                if let json = response.data {
                    let data = JSON(data: json)
                    print(data)
                    self.countArray.append(data.count)
                    
                    if(data.count > 0){
                        for k in 0..<data.count{
                           // let id : Int = data[k]["SrNo"].intValue
                           // let userFBId = data[k]["FbUserId"]
                            let tourName = data[k]["TourName"]
                            //let Details = data[k]["Detail"]
                            
                            
                            let json1 = data[k]["Detail"]
                            
                            //print("data \(json1["name"])")
                            //self.positionArray.insert(2, at: indexPath.row+1)
                            
                            self.subsections.append(SubSections(title: tourName.string!, desc: json1["Description"].string!, like:"0", share:"0", image:"",expList:json1["SrNumber"].arrayObject as! Array<String> ))
                            
                            self.tableView.reloadData()
                        }
                        
                    }
                    //let data1 = JSON(String: json1)
                    //print("data1 \(data1)")
                }
                print(self.subsections)
                NVActivityIndicatorPresenter.sharedInstance.stopAnimating()
                self.tableView.reloadData()
            }
            
        } catch {
            print(error.localizedDescription)
        }
        
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        getSections()
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return subsections.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = Bundle.main.loadNibNamed("ViewExpTableViewCell", owner: self, options: nil)?.first as! ViewExpTableViewCell
        
        
        
        
        cell.titleLabel.text = subsections[indexPath.row].title
        cell.descTextview.text = subsections[indexPath.row].desc
        cell.likeCountLabel.text = subsections[indexPath.row].like
        cell.shareCountLabel.text = subsections[indexPath.row].share
        cell.leftImage.layer.cornerRadius = 10.0
        cell.backgroundColor = UIColor(red:0.04, green:0.05, blue:0.11, alpha:1)
        return cell
    }

    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
       return 115
    }
    /*
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Configure the cell...

        return cell
    }
    */

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
