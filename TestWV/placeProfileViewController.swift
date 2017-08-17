//
//  placeProfileViewController.swift
//  TestWV
//
//  Created by earth on 17/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class placeProfileViewController: UIViewController {

    @IBOutlet weak var mainImage: UIView!
    
    @IBOutlet weak var headTitleLabel: UILabel!
    
    @IBOutlet weak var ratingImage: UIImageView!
    
    @IBOutlet weak var ratingCountLabel: UILabel!
    
    @IBOutlet weak var distanceLabel: UILabel!
    
    @IBOutlet weak var qualityLabel: UILabel!
    
    @IBOutlet weak var headerStatusLabel: UILabel!
    
    @IBOutlet weak var backBtn: UIButton!
    
    @IBOutlet weak var foursquareView: UIView!
    
    @IBOutlet weak var yelpView: UIView!
    
    @IBOutlet weak var detailsTextView: UITextView!
    
    @IBOutlet weak var mapBoxView: UIView!
    
    @IBOutlet weak var addressLabel: UILabel!
    
    @IBOutlet weak var phoneNumberLabel: UILabel!
    
    @IBOutlet weak var websiteLabel: UILabel!
    
    @IBOutlet weak var durationLabel: UILabel!
    
    @IBOutlet weak var footerStatusLabel: UILabel!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
        renderLayout()
        // Do any additional setup after loading the view.
    }
    
    @IBAction func backBtnClicked(_ sender: UIButton) {
    }
    
    
    public func renderLayout(){
        let imageView = UIImageView()
        
        imageView.frame  = CGRect(x: -104, y: 188, width: 920, height: 603)
        
        let layer = UIView(frame: CGRect(x: 0, y: 390, width: 750, height: 400))
        layer.layer.borderWidth = 1
        layer.layer.borderColor = UIColor.black.cgColor
        
        let gradient = CAGradientLayer()
        gradient.frame = CGRect(x: 0, y: 0, width: 750, height: 400)
        gradient.colors = [
            UIColor.black.cgColor,
            UIColor.black.cgColor
        ]
        gradient.locations = [0, 1]
        gradient.startPoint = CGPoint.zero
        gradient.endPoint = CGPoint(x: 0, y: 1)
        layer.layer.addSublayer(gradient)
        
        self.view.addSubview(imageView)
        
        
        self.view.addSubview(layer)
        let layer1 = UIView(frame: CGRect(x: 0, y: 210, width: 750, height: 2600))
        layer.backgroundColor = UIColor.red
        self.view.addSubview(layer1)
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
    
    override func viewWillLayoutSubviews() {
        let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 150, height: 40))
        imageView.contentMode = .scaleAspectFit
        
        let image = UIImage(named: "logo")
        imageView.image = image
        
        navigationItem.titleView = imageView
        UINavigationBar.appearance().setBackgroundImage(UIImage(named: "header_bg")!.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .stretch), for: .default)
    }

}
