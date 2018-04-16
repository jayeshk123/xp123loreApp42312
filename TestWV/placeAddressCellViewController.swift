//
//  placeAddressCellViewController.swift
//  TestWV
//
//  Created by earth on 14/09/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import NVActivityIndicatorView
import UICircularProgressRing

class placeAddressCellViewController: UIViewController {
    var dbQueue: DatabaseQueue!

    @IBOutlet weak var addressLabel: UILabel!
    
    @IBOutlet weak var phoneLabel: UILabel!
    
    @IBOutlet weak var websiteLabel: UILabel!
    
    @IBOutlet weak var timeLabel: UILabel!
    
    @IBOutlet weak var statusLabel: UILabel!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()
        getPlaceDetails()
        // Do any additional setup after loading the view.
    }

    public func getPlaceDetails(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            try dbQueue.inDatabase { db in
                
                
                let rows = try Row.fetchCursor(db, "SELECT * FROM placeProfile")
                while let row = try rows.next() {
                    
                    var address: String = row.value(named: "address")
                    var website: String = row.value(named: "website")
                    var phone: String = row.value(named: "phone")
                    
                    
                    if(website == "undefined"){
                        website = "N/A"
                    }
                    
                    if(phone == "undefined"){
                        phone = "N/A"
                    }
                    
                    if(address == "undefined"){
                        address = "N/A"
                    }
                    
                    websiteLabel.text = website
                    phoneLabel.text = phone
                    addressLabel.text = address
                    
                    
                }
            }
        } catch {
            print(error.localizedDescription)
        }
        
    }
    
    
    
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
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
